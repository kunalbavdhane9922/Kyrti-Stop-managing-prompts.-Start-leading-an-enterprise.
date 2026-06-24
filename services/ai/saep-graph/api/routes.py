from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database.neo4j_client import neo4j_client

router = APIRouter()

class RelationshipRequest(BaseModel):
    source_label: str
    source_id: str
    target_label: str
    target_id: str
    relationship_type: str
    properties: dict = {}

@router.post("/relationships")
def create_relationship(req: RelationshipRequest):
    query = f"""
    MERGE (a:{req.source_label} {{id: $source_id}})
    MERGE (b:{req.target_label} {{id: $target_id}})
    MERGE (a)-[r:{req.relationship_type}]->(b)
    SET r += $properties
    RETURN a, r, b
    """
    
    try:
        result = neo4j_client.run_query(query, {
            "source_id": req.source_id,
            "target_id": req.target_id,
            "properties": req.properties
        })
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/nodes/{label}/{node_id}/relationships")
def get_node_relationships(label: str, node_id: str):
    query = f"""
    MATCH (n:{label} {{id: $node_id}})-[r]-(target)
    RETURN type(r) as relationship, labels(target)[0] as target_label, target.id as target_id
    """
    try:
        result = neo4j_client.run_query(query, {"node_id": node_id})
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/professionals/{worker_id}/graph")
def get_professional_graph(worker_id: str):
    # Fetch the complete structural graph for a Professional
    query = """
    MATCH (w:Worker {id: $worker_id})
    OPTIONAL MATCH (w)-[:HAS_SKILL]->(s:Skill)
    OPTIONAL MATCH (w)-[:WORKS_FOR]->(c:Company)
    RETURN w, collect(s) as skills, c as company
    """
    try:
        result = neo4j_client.run_query(query, {"worker_id": worker_id})
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/companies/{company_id}/workforce")
def get_company_workforce(company_id: str):
    # Fetch all workers for a company
    query = """
    MATCH (w:Worker)-[:WORKS_FOR]->(c:Company {id: $company_id})
    RETURN w.id as worker_id, w.name as worker_name
    """
    try:
        result = neo4j_client.run_query(query, {"company_id": company_id})
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

