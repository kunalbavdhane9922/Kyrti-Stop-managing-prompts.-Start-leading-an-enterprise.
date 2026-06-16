import os

files = [
    'saep-gateway/src/main/resources/application.yml',
    'saep-identity/src/main/resources/application.yml',
    'services/saep-parent/saep-company/src/main/resources/application.yml',
    'services/saep-parent/saep-organization/src/main/resources/application.yml',
    'services/saep-parent/saep-workforce/src/main/resources/application.yml'
]

content_to_append = """
logging:
  pattern:
    level: "%5p [${spring.application.name:}, traceId=%X{traceId:-}, spanId=%X{spanId:-}, tenantId=%X{tenantId:-}, companyId=%X{companyId:-}, correlationId=%X{correlationId:-}]"

management:
  zipkin:
    tracing:
      endpoint: ${ZIPKIN_ENDPOINT:http://localhost:9411/api/v2/spans}
  endpoint:
    health:
      show-details: always
  endpoints:
    web:
      exposure:
        include: "health,info,prometheus,metrics"
  metrics:
    tags:
      application: ${spring.application.name}
"""

for f in files:
    if os.path.exists(f):
        with open(f, 'r') as file:
            lines = file.readlines()
            
        # Filter out existing logging and management blocks
        new_lines = []
        skip_mode = False
        for line in lines:
            if line.startswith('logging:') or line.startswith('management:'):
                skip_mode = True
            elif skip_mode and not line.startswith(' ') and line.strip() != '':
                skip_mode = False
                
            if not skip_mode:
                new_lines.append(line)
                
        with open(f, 'w') as file:
            file.writelines(new_lines)
            file.write(content_to_append)
        print(f"Updated {f}")
