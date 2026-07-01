# Virtual Office Source Code

This file contains the complete, updated source code for the requested components of the Sovereign Virtual Office.

## 1. virtual-office-web/src/App.jsx
`jsx
import React, { useState, useEffect, useRef } from 'react';
import GameComponent from './GameComponent';
import { Mic, MessageSquare, Users, Settings, CalendarPlus, Video, Store } from 'lucide-react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import useSpatialStore from './store/spatialStore';
import SpatialMarketplace from './components/spatial/SpatialMarketplace';
import ProximityChatPanel from './components/spatial/ProximityChatPanel';
import DashboardOverlay from './components/spatial/DashboardOverlay';
import SpatialExpansionModal from './components/spatial/SpatialExpansionModal';
import { AppLayout } from './components/layout/AppLayout';
import { Activity } from 'lucide-react';

function App() {
  const { toggleMarketplace, openChat, closeChat, activeChatTarget, toggleDashboard, toggleExpansionModal } = useSpatialStore();
  
  // Jitsi Proximity State
  const [jitsiRoom, setJitsiRoom] = useState(null);
  const wsRef = useRef(null);
  const [wsInstance, setWsInstance] = useState(null);

  useEffect(() => {
    // Shared WS connection
    const clientId = 'client_' + Math.floor(Math.random() * 10000);
    const ws = new WebSocket(`ws://localhost:8000/ws/${clientId}`);
    wsRef.current = ws;

    ws.onopen = () => {
        setWsInstance(ws);
    };

    const handleProximity = (e) => {
      useSpatialStore.getState().openChat({ id: e.detail.id, name: e.detail.name });
    };

    const handleProximityLost = () => {
      useSpatialStore.getState().closeChat();
    };

    const handleJitsiJoin = (e) => {
      setJitsiRoom(e.detail.roomName);
    };

    const handleJitsiLeave = () => {
      setJitsiRoom(null);
    };

    window.addEventListener('ai_proximity', handleProximity);
    window.addEventListener('ai_proximity_lost', handleProximityLost);
    window.addEventListener('jitsi_join', handleJitsiJoin);
    window.addEventListener('jitsi_leave', handleJitsiLeave);
    
    return () => {
      window.removeEventListener('ai_proximity', handleProximity);
      window.removeEventListener('ai_proximity_lost', handleProximityLost);
      window.removeEventListener('jitsi_join', handleJitsiJoin);
      window.removeEventListener('jitsi_leave', handleJitsiLeave);
      // Only close if it's open to prevent the "closed before established" error during React StrictMode
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      } else {
        // If connecting, wait for open then close to avoid the browser error log
        ws.onopen = () => ws.close();
      }
    };
  }, []); // Empty dependency array so WS only connects once on mount

  return (
    <AppLayout>
      {/* 2D Floor Plan Layer */}
      <div className="absolute inset-0 w-full h-full">
        <GameComponent ws={wsInstance} />
      </div>

      {/* Jitsi Meeting Overlay */}
      <div className={`transition-all duration-500 ease-in-out border-l border-[#1e293b] bg-[#020617] flex flex-col shadow-2xl absolute right-0 top-0 h-full z-50 pointer-events-auto
        ${jitsiRoom ? 'w-[450px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
        
        <div className="bg-[#0f172a] text-white p-5 flex items-center justify-between border-b border-[#1e293b] z-10 w-full min-w-[450px]">
          <div className="flex items-center gap-3 font-semibold text-sm tracking-widest uppercase text-slate-300">
            <Video size={18} className="text-blue-400" />
            Active Session: {jitsiRoom}
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-emerald-400 font-mono tracking-wider">LIVE</span>
          </div>
        </div>
        
        <div className="flex-1 relative w-[450px] bg-black">
          {jitsiRoom && (
            <JitsiMeeting
                domain="meet.jit.si"
                roomName={`VirtualOffice_Corp_${jitsiRoom}`}
                configOverwrite={{ startWithAudioMuted: false, disableModeratorIndicator: true }}
                interfaceConfigOverwrite={{ DISABLE_JOIN_LEAVE_NOTIFICATIONS: true, SHOW_JITSI_WATERMARK: false }}
                userInfo={{ displayName: 'Executive User' }}
                getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; iframeRef.style.width = '100%'; }}
            />
          )}
        </div>
      </div>

      {/* Modals & Overlays */}
      <div className="pointer-events-auto">
        <SpatialMarketplace ws={wsInstance} />
        <ProximityChatPanel ws={wsInstance} />
        <DashboardOverlay />
        <SpatialExpansionModal />
      </div>
    </AppLayout>
  );
}

export default App;

`

## 2. virtual-office-web/src/GameComponent.jsx
`jsx
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.agents = [];
  }

  preload() {
    this.load.image('tileset5_export', 'assets/tileset5_export.png');
    this.load.image('tileset6_export', 'assets/tileset6_export.png');
    this.load.image('tileset1', 'assets/tileset1.png');
    this.load.image('tileset1-repositioning', 'assets/tileset1-repositioning.png');
    this.load.image('Special_Zones', 'assets/Special_Zones.png');
    this.load.tilemapTiledJSON('workadventure-map', 'assets/custom-office.json');
  }

  create() {
    // Set a neutral background color to verify transparency
    this.cameras.main.setBackgroundColor('#0A0A0A'); 
    
    let map;
    try {
        map = this.make.tilemap({ key: 'workadventure-map' });
        
        // Add all tilesets
        const ts5 = map.addTilesetImage('tileset5_export', 'tileset5_export');
        const ts6 = map.addTilesetImage('tileset6_export', 'tileset6_export');
        const ts1 = map.addTilesetImage('tileset1', 'tileset1');
        const ts1r = map.addTilesetImage('tileset1-repositioning', 'tileset1-repositioning');
        const sz = map.addTilesetImage('Special_Zones', 'Special_Zones');

        const allTilesets = [ts5, ts6, ts1, ts1r, sz].filter(t => t != null);

        // Render all layers dynamically
        map.layers.forEach((layerData, index) => {
           const layer = map.createLayer(layerData.name, allTilesets, 0, 0);
           if (layer) {
               // Base depth on layer index (so higher layers render on top)
               layer.setDepth(index);
               
               // If it's a collision layer, make it invisible and set collision
               if (layerData.name.toLowerCase().includes('collide') || layerData.name.toLowerCase().includes('collision')) {
                   layer.setVisible(false);
                   layer.setCollisionByExclusion([-1]);
               }
           }
        });

        // Set physics bounds and camera bounds
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
    } catch (e) {
        console.error("Phaser parsing crash prevented:", e);
        this.cameras.main.setBackgroundColor('#8b0000');
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Map Error: ' + e.message, { font: '24px Arial', fill: '#ffffff' }).setOrigin(0.5);
        return;
    }
    
    this.map = map;
    
    // Draw a sleek geometric player avatar
    this.player = this.add.rectangle(map.widthInPixels / 2, map.heightInPixels / 2, 32, 32, 0x5E6AD2);
    this.player.setStrokeStyle(2, 0xFFFFFF);
    this.player.setDepth(100); // Placed above most layers
    
    // Enable physics on player
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    
    // Add colliders between player and all collision layers
    map.layers.forEach((layerData) => {
        if (layerData.name.toLowerCase().includes('collide') || layerData.name.toLowerCase().includes('collision')) {
            const layer = map.getLayer(layerData.name).tilemapLayer;
            if (layer) this.physics.add.collider(this.player, layer);
        }
    });

    // Center camera on player
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.5);

    // Setup input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');

    // Bind custom event for AI spawning bridging React to Phaser
    this.onSpawnAgent = this.handleSpawnAgent.bind(this);
    window.addEventListener('spawn_ai_agent', this.onSpawnAgent);
  }

  update() {
    if (!this.player || !this.player.body) return;

    const speed = 250;
    this.player.body.setVelocity(0);

    if (this.cursors.left.isDown || this.wasd.A.isDown) {
        this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
        this.player.body.setVelocityX(speed);
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
        this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
        this.player.body.setVelocityY(speed);
    }
  }

  handleSpawnAgent(e) {
     const { x, y } = e.detail;
     // Tile size is 32x32. Offset by 16 to center sprite in the tile
     const spawnX = (x * 32) + 16;
     const spawnY = (y * 32) + 16;
     
     const agent = this.add.sprite(spawnX, spawnY, 'player');
     agent.setFrame(0);
     agent.setDepth(10);
     agent.setTint(0x00ff00); // Tint AI agent so it stands out
     this.agents.push(agent);
  }

  shutdown() {
     // Clean up listener
     window.removeEventListener('spawn_ai_agent', this.onSpawnAgent);
  }
}

export default function GameComponent({ ws }) {
  const gameRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Wrap Game creation in a setTimeout to fix React 18 Strict Mode double-mount canvas crash
    timeoutRef.current = setTimeout(() => {
        if (!gameRef.current) {
          gameRef.current = new Phaser.Game({
            type: Phaser.WEBGL,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: 'phaser-game',
            scene: [GameScene],
            pixelArt: true,
            physics: {
              default: 'arcade',
              arcade: { debug: false },
            },
            scale: {
              mode: Phaser.Scale.RESIZE,
              autoCenter: Phaser.Scale.CENTER_BOTH,
            },
          });
        }
    }, 100);

    return () => {
      clearTimeout(timeoutRef.current);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'MAP_UPDATED' || data.type === 'map_reload') {
            console.log('Map update received, restarting scene to render new boundaries...');
            if (gameRef.current && gameRef.current.scene) {
              const scene = gameRef.current.scene.getScene('GameScene');
              if (scene) {
                // Remove corrupted/old tilemap from cache and restart
                scene.cache.tilemap.remove('office-map');
                scene.scene.restart();
              }
            }
          } else if (data.type === 'AGENT_SPAWNED' || data.type === 'agent_spawned' || data.type === 'spawn_ai_agent') {
             // Dispatch to Phaser scene
             window.dispatchEvent(new CustomEvent('spawn_ai_agent', { detail: { x: data.x, y: data.y } }));
          }
        } catch (e) {
          console.error("Error parsing websocket message:", e);
        }
    };

    ws.addEventListener('message', handleMessage);

    return () => {
      ws.removeEventListener('message', handleMessage);
    };
  }, [ws]);

  return <div id="phaser-game" />;
}

`

## 3. virtual-office-web/src/index.css
`css
@import "tailwindcss";

@theme {
  --shadow-glass: 0 4px 30px rgba(0, 0, 0, 0.5);
  --shadow-neon-indigo: 0 0 20px rgba(94, 106, 210, 0.4);
}

@layer base {
  html, body {
    background-color: #0A0A0A;
    color: #EEEEEE;
    overflow: hidden;
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
  }

  /* Custom scrollbar for webkit (Linear/Arc style) */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #2A2A2A;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #3A3A3A;
  }
}

@layer utilities {
  .text-glow {
    text-shadow: 0 0 10px rgba(94, 106, 210, 0.5);
  }
}

`

## 4. virtual-office-server/MapEngine.py
`python
import json
import os
import copy

MAP_PATH = r"D:\College\Projects\AI BUSSINESS\git_hub_branch\virtual-office-web\public\assets\office-map.json"

# Tile IDs
FLOOR_TILE = 30
CARPET_TILE = 65
WALL_TOP = 15
WALL_SIDE = 16
DESK_TILE = 142
CHAIR_TILE = 148
COLLISION_TILE = 1
EMPTY_TILE = 0 # Fixed: Phaser requires 0 for transparent empty tiles

def calculate_optimal_expansion(map_data, req_width, req_height):
    width = map_data["width"]
    height = map_data["height"]
    collisions = next(l for l in map_data["layers"] if l["name"] == "collisions")["data"]
    
    max_x, max_y = 0, 0
    for idx, tile_val in enumerate(collisions):
        if tile_val not in [-1, 0, EMPTY_TILE]: # Valid collision
            x = idx % width
            y = idx // width
            max_x = max(max_x, x)
            max_y = max(max_y, y)
            
    padding_x = 2
    padding_y = 2
    target_width = max_x + req_width + padding_x
    target_height = max_y + req_height + padding_y
    
    add_width = max(0, target_width - width)
    add_height = max(0, target_height - height)
    
    return add_width, add_height, max_x + 1, max_y + 1

def expand_map_perfectly(map_data, req_width, req_height):
    add_w, add_h, append_x, append_y = calculate_optimal_expansion(map_data, req_width, req_height)
    
    if add_w > 0 or add_h > 0:
        new_width = map_data["width"] + add_w
        new_height = map_data["height"] + add_h
        
        for layer in map_data["layers"]:
            if "data" not in layer: continue
            
            old_data = layer["data"]
            fill_tile = FLOOR_TILE if layer["name"] == "floor" else EMPTY_TILE
            new_data = [fill_tile] * (new_width * new_height)
            
            for y in range(map_data["height"]):
                for x in range(map_data["width"]):
                    old_idx = y * map_data["width"] + x
                    # Pad safely preserving arrays by ignoring corrupted invalid old lengths
                    if old_idx < len(old_data):
                        new_data[y * new_width + x] = old_data[old_idx]
                    
            layer["data"] = new_data
            layer["width"] = new_width
            layer["height"] = new_height
            
        map_data["width"] = new_width
        map_data["height"] = new_height
        
    return append_x, append_y, (add_w > 0 or add_h > 0)

def find_empty_region(collisions_data, map_width, map_height, req_width, req_height):
    PAD = 2
    for sy in range(PAD, map_height - req_height - PAD):
        for sx in range(PAD, map_width - req_width - PAD):
            fits = True
            for dy in range(req_height):
                for dx in range(req_width):
                    idx = (sy + dy) * map_width + (sx + dx)
                    if idx >= len(collisions_data) or collisions_data[idx] not in [-1, 0, EMPTY_TILE]:
                        fits = False
                        break
                if not fits:
                    break
            if fits:
                return (sx, sy)
    return None

def stamp_office_cabin(map_width, floor_layer, walls_layer, furniture_layer, collisions_layer, start_x, start_y, width, height, chairs):
    desk_positions = []
    for y in range(start_y, start_y + height):
        for x in range(start_x, start_x + width):
            idx = y * map_width + x
            floor_layer["data"][idx] = CARPET_TILE
            
            if y == start_y or y == start_y + height - 1 or x == start_x or x == start_x + width - 1:
                if y == start_y + height - 1 and x == start_x + width // 2:
                    walls_layer["data"][idx] = EMPTY_TILE
                    collisions_layer["data"][idx] = EMPTY_TILE
                else:
                    walls_layer["data"][idx] = WALL_TOP
                    collisions_layer["data"][idx] = COLLISION_TILE
            else:
                walls_layer["data"][idx] = EMPTY_TILE
                collisions_layer["data"][idx] = EMPTY_TILE
                
            if furniture_layer:
                furniture_layer["data"][idx] = EMPTY_TILE
                
    if furniture_layer:
        cx, cy = start_x + width // 2, start_y + height // 2
        idx = cy * map_width + cx
        furniture_layer["data"][idx] = DESK_TILE
        collisions_layer["data"][idx] = COLLISION_TILE
        if chairs >= 1: 
            furniture_layer["data"][idx + map_width] = CHAIR_TILE
        desk_positions.append({"x": cx, "y": cy + 1})
        
    return desk_positions

def stamp_desk_cluster(map_width, floor_layer, walls_layer, furniture_layer, collisions_layer, start_x, start_y, width, height):
    desk_positions = []
    for y in range(start_y, start_y + height):
        for x in range(start_x, start_x + width):
            idx = y * map_width + x
            floor_layer["data"][idx] = FLOOR_TILE
            walls_layer["data"][idx] = EMPTY_TILE
            collisions_layer["data"][idx] = EMPTY_TILE
            if furniture_layer: furniture_layer["data"][idx] = EMPTY_TILE
            
    if furniture_layer:
        for dx, dy in [(1,1), (3,1), (1,3), (3,3)]:
            cx, cy = start_x + dx, start_y + dy
            idx = cy * map_width + cx
            furniture_layer["data"][idx] = DESK_TILE
            collisions_layer["data"][idx] = COLLISION_TILE
            furniture_layer["data"][idx + map_width] = CHAIR_TILE
            desk_positions.append({"x": cx, "y": cy + 1})
            
    return desk_positions

def build_infrastructure(item_type="office_cabin", config=None):
    if config is None:
        config = {}
        
    width = config.get("width", 8)
    height = config.get("height", 6)
    chairs = config.get("chairs", 1)
    
    if item_type == "desk_cluster":
        width = 6
        height = 5
    elif item_type == "ai_agent":
        width = 2
        height = 2

    if not os.path.exists(MAP_PATH):
        return {"success": False, "reason": "Map not found"}
        
    with open(MAP_PATH, "r", encoding="utf-8") as f:
        map_data = json.load(f)
        
    floor_layer = next((l for l in map_data["layers"] if l["name"] == "floor"), None)
    walls_layer = next((l for l in map_data["layers"] if l["name"] == "walls"), None)
    furniture_layer = next((l for l in map_data["layers"] if l["name"] == "furniture"), None)
    collisions_layer = next((l for l in map_data["layers"] if l["name"] == "collisions"), None)
    
    if not floor_layer or not walls_layer or not collisions_layer:
        return {"success": False, "reason": "Required layers missing"}

    map_expanded = False
    pos = find_empty_region(collisions_layer["data"], map_data["width"], map_data["height"], width, height)
    
    if not pos:
        pos_x, pos_y, map_expanded = expand_map_perfectly(map_data, width, height)
        pos = (pos_x, pos_y)

    if not pos:
        return {"success": False, "reason": "Could not allocate space mathematically."}
        
    start_x, start_y = pos
    map_width = map_data["width"]
    map_height = map_data["height"]
    
    desk_positions = []
    zones = []
    
    if item_type == "office_cabin":
        desk_positions = stamp_office_cabin(map_width, floor_layer, walls_layer, furniture_layer, collisions_layer, start_x, start_y, width, height, chairs)
        zones.append({
            "id": f"cabin_{start_x}_{start_y}",
            "name": "Private Cabin",
            "x": start_x, "y": start_y, "w": width, "h": height,
            "private": True
        })
        
    elif item_type == "desk_cluster":
        desk_positions = stamp_desk_cluster(map_width, floor_layer, walls_layer, furniture_layer, collisions_layer, start_x, start_y, width, height)
                
    elif item_type == "ai_agent":
        desk_positions.append({"x": start_x, "y": start_y})

    # CRITICAL MATH VALIDATION STEP
    # Validate that every layer's data array length EXACTLY matches new_width * new_height
    expected_length = map_width * map_height
    for layer in map_data["layers"]:
        if "data" in layer:
            if len(layer["data"]) != expected_length:
                # Pad out arrays to fix the length mismatch corruption
                fill_tile = FLOOR_TILE if layer["name"] == "floor" else EMPTY_TILE
                if len(layer["data"]) > expected_length:
                    layer["data"] = layer["data"][:expected_length]
                else:
                    layer["data"].extend([fill_tile] * (expected_length - len(layer["data"])))

    with open(MAP_PATH, "w", encoding="utf-8") as f:
        json.dump(map_data, f)

    return {
        "success": True,
        "fullReload": map_expanded,
        "changes": [], 
        "zones": zones,
        "deskPositions": desk_positions
    }

`

## 5. compile_office.py
`python
import json
import os
from PIL import Image
import math

def color_distance(c1, c2):
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(c1, c2)))

def closest_tile_type(color):
    r, g, b = color
    # Define our known blueprint colors and their corresponding Tile IDs
    palette = {
        "WALL": ((0, 0, 0), {"floor": 201, "walls": 58, "furniture": 0, "collision": 443}),
        "FLOOR": ((70, 80, 90), {"floor": 201, "walls": 0, "furniture": 0, "collision": 0}),
        "DESK": ((70, 30, 20), {"floor": 201, "walls": 0, "furniture": 340, "collision": 443}),
        "PLANT": ((20, 80, 60), {"floor": 201, "walls": 0, "furniture": 351, "collision": 443}),
        "CARPET": ((100, 110, 120), {"floor": 223, "walls": 0, "furniture": 0, "collision": 0})
    }
    
    best_dist = float('inf')
    best_type = "FLOOR"
    for name, (pal_color, tiles) in palette.items():
        dist = color_distance(color, pal_color)
        if dist < best_dist:
            best_dist = dist
            best_type = name
            
    return palette[best_type][1]

def build_map():
    img = Image.open('office.png').convert('RGB')
    width, height = img.size
    
    tile_w, tile_h = 32, 32
    grid_w = width // tile_w
    grid_h = height // tile_h
    
    floor_data = [0] * (grid_w * grid_h)
    walls_data = [0] * (grid_w * grid_h)
    furn_data = [0] * (grid_w * grid_h)
    coll_data = [0] * (grid_w * grid_h)
    start_data = [0] * (grid_w * grid_h)
    
    for gy in range(grid_h):
        for gx in range(grid_w):
            idx = gy * grid_w + gx
            px = gx * tile_w + (tile_w // 2)
            py = gy * tile_h + (tile_h // 2)
            color = img.getpixel((px, py))
            
            tiles = closest_tile_type(color)
            floor_data[idx] = tiles["floor"]
            walls_data[idx] = tiles["walls"]
            furn_data[idx] = tiles["furniture"]
            coll_data[idx] = tiles["collision"]
            
            # Place a spawn point near the center if it's empty floor
            if gx == grid_w // 2 and gy == grid_h // 2:
                start_data[idx] = 444
    
    def create_layer(name, data):
        return {
            "data": data, "height": grid_h, "name": name, "opacity": 1, 
            "type": "tilelayer", "visible": True, "width": grid_w, "x": 0, "y": 0
        }

    map_json = {
        "width": grid_w,
        "height": grid_h,
        "tilewidth": 32,
        "tileheight": 32,
        "orientation": "orthogonal",
        "layers": [
            create_layer("start", start_data),
            create_layer("floor", floor_data),
            create_layer("walls", walls_data),
            create_layer("furniture", furn_data),
            create_layer("collisions", coll_data)
        ],
        "tilesets": [
            {"firstgid": 1, "image": "../assets/tileset5_export.png", "name": "tileset5_export", "tilewidth": 32, "tileheight": 32, "imagewidth": 512, "imageheight": 512},
            {"firstgid": 101, "image": "../assets/tileset6_export.png", "name": "tileset6_export", "tilewidth": 32, "tileheight": 32, "imagewidth": 512, "imageheight": 512},
            {"firstgid": 201, "image": "../assets/tileset1.png", "name": "tileset1", "tilewidth": 32, "tileheight": 32, "imagewidth": 512, "imageheight": 512},
            {"firstgid": 322, "image": "../assets/tileset1-repositioning.png", "name": "tileset1-repositioning", "tilewidth": 32, "tileheight": 32, "imagewidth": 512, "imageheight": 512},
            {"firstgid": 443, "image": "../assets/Special_Zones.png", "name": "Special_Zones", "tilewidth": 32, "tileheight": 32, "imagewidth": 512, "imageheight": 512}
        ]
    }

    with open(r'd:\College\Projects\AI BUSSINESS\git_hub_branch\virtual office\virtual-office-web\public\assets\custom-office.json', 'w') as f:
        json.dump(map_json, f)

    print("custom-office.json successfully compiled from office.png!")

if __name__ == "__main__":
    build_map()

`

## 6. generate_big_office.py
`python
import json
import os

WIDTH = 88
HEIGHT = 48

def create_layer(name, data):
    return {
        "data": data,
        "height": HEIGHT,
        "name": name,
        "opacity": 1,
        "type": "tilelayer",
        "visible": True,
        "width": WIDTH,
        "x": 0,
        "y": 0
    }

def idx(x, y):
    return y * WIDTH + x

floor_data = [201] * (WIDTH * HEIGHT)
walls_data = [0] * (WIDTH * HEIGHT)
furn_data = [0] * (WIDTH * HEIGHT)
coll_data = [0] * (WIDTH * HEIGHT)
start_data = [0] * (WIDTH * HEIGHT)

# Create outer walls
for x in range(WIDTH):
    walls_data[idx(x, 0)] = 58
    coll_data[idx(x, 0)] = 443
    walls_data[idx(x, HEIGHT - 1)] = 63
    coll_data[idx(x, HEIGHT - 1)] = 443
for y in range(HEIGHT):
    walls_data[idx(0, y)] = 45
    coll_data[idx(0, y)] = 443
    walls_data[idx(WIDTH - 1, y)] = 73
    coll_data[idx(WIDTH - 1, y)] = 443

def build_room(start_x, start_y, w, h, door_x, door_y):
    for x in range(start_x, start_x + w):
        walls_data[idx(x, start_y)] = 58
        coll_data[idx(x, start_y)] = 443
        walls_data[idx(x, start_y + h - 1)] = 63
        coll_data[idx(x, start_y + h - 1)] = 443
    for y in range(start_y, start_y + h):
        walls_data[idx(start_x, y)] = 45
        coll_data[idx(start_x, y)] = 443
        walls_data[idx(start_x + w - 1, y)] = 73
        coll_data[idx(start_x + w - 1, y)] = 443
    
    # Door
    walls_data[idx(door_x, door_y)] = 0
    coll_data[idx(door_x, door_y)] = 0

def stamp_desk(x, y):
    furn_data[idx(x, y)] = 340
    coll_data[idx(x, y)] = 443
    furn_data[idx(x+1, y)] = 325
    coll_data[idx(x+1, y)] = 443

# Build Executive Suites (Top Left)
build_room(2, 2, 20, 15, 12, 16)
stamp_desk(10, 8)
stamp_desk(14, 8)

# Build Engineering Bullpen (Top Right)
build_room(40, 2, 40, 25, 40, 15)
for dx in range(45, 75, 5):
    for dy in range(6, 20, 4):
        stamp_desk(dx, dy)

# Build Marketing / Sales (Bottom Left)
build_room(2, 25, 30, 20, 32, 35)
for dx in range(6, 25, 5):
    for dy in range(30, 40, 4):
        stamp_desk(dx, dy)

# Build Cafeteria / Lounge (Bottom Right)
build_room(50, 30, 35, 15, 50, 35)
for dx in range(55, 80, 8):
    for dy in range(35, 42, 6):
        stamp_desk(dx, dy) # use desks as tables for now

start_data[idx(35, 25)] = 444 # Spawn in center lobby

map_json = {
    "width": WIDTH,
    "height": HEIGHT,
    "tilewidth": 32,
    "tileheight": 32,
    "orientation": "orthogonal",
    "layers": [
        create_layer("start", start_data),
        create_layer("floor", floor_data),
        create_layer("walls", walls_data),
        create_layer("furniture", furn_data),
        create_layer("collisions", coll_data)
    ],
    "tilesets": [
        {"firstgid": 1, "image": "../assets/tileset5_export.png", "name": "tileset5_export", "tilewidth": 32, "tileheight": 32, "imagewidth": 512, "imageheight": 512},
        {"firstgid": 101, "image": "../assets/tileset6_export.png", "name": "tileset6_export", "tilewidth": 32, "tileheight": 32, "imagewidth": 512, "imageheight": 512},
        {"firstgid": 201, "image": "../assets/tileset1.png", "name": "tileset1", "tilewidth": 32, "tileheight": 32, "imagewidth": 512, "imageheight": 512},
        {"firstgid": 322, "image": "../assets/tileset1-repositioning.png", "name": "tileset1-repositioning", "tilewidth": 32, "tileheight": 32, "imagewidth": 512, "imageheight": 512},
        {"firstgid": 443, "image": "../assets/Special_Zones.png", "name": "Special_Zones", "tilewidth": 32, "tileheight": 32, "imagewidth": 512, "imageheight": 512}
    ]
}

with open(r'd:\College\Projects\AI BUSSINESS\git_hub_branch\virtual office\virtual-office-web\public\assets\big-office.json', 'w') as f:
    json.dump(map_json, f)

print("big-office.json successfully generated!")

`

