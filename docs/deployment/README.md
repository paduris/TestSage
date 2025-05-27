# TestSage Deployment Guide

## Local Development Deployment

### Prerequisites
- Docker Desktop
- Java 17
- Node.js 18+
- PostgreSQL (optional if using Docker)
- OpenAI API Key

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/testsage.git
cd testsage
```

2. Create environment files:

Backend environment file (`backend/.env`):
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/testsage
SPRING_DATASOURCE_USERNAME=testsage
SPRING_DATASOURCE_PASSWORD=hackathon2025
SPRING_JPA_HIBERNATE_DDL_AUTO=update
OPENAI_API_KEY=your_openai_api_key
```

3. Start the application using Docker Compose:
```bash
docker compose --env-file backend/.env up -d --build
```

4. Verify deployment:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Database: localhost:5432

## Production Deployment

### Prerequisites
- Kubernetes cluster
- Docker registry access
- SSL certificates
- Domain name
- Cloud database service (e.g., AWS RDS, GCP Cloud SQL)

### Container Registry Setup

1. Build and tag images:
```bash
docker build -t testsage-backend ./backend
docker build -t testsage-frontend ./frontend
```

2. Push to registry:
```bash
docker tag testsage-backend registry.example.com/testsage-backend:latest
docker tag testsage-frontend registry.example.com/testsage-frontend:latest
docker push registry.example.com/testsage-backend:latest
docker push registry.example.com/testsage-frontend:latest
```

### Kubernetes Deployment

1. Create namespace:
```bash
kubectl create namespace testsage
```

2. Create secrets:
```bash
kubectl create secret generic testsage-secrets \
  --from-literal=DB_PASSWORD=your_db_password \
  --from-literal=OPENAI_API_KEY=your_openai_api_key \
  -n testsage
```

3. Apply Kubernetes manifests:
```bash
kubectl apply -f k8s/
```

### SSL/TLS Configuration

1. Install cert-manager:
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.8.0/cert-manager.yaml
```

2. Create SSL certificate:
```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: testsage-tls
  namespace: testsage
spec:
  secretName: testsage-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
    - testsage.example.com
```

### Monitoring Setup

1. Install Prometheus and Grafana:
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack
```

2. Configure monitoring dashboards in Grafana.

### Backup and Recovery

1. Database backups:
```bash
kubectl create cronjob testsage-db-backup \
  --schedule="0 2 * * *" \
  --image=postgres:15 \
  -- pg_dump -h $DB_HOST -U $DB_USER testsage > backup.sql
```

2. Configure backup retention and storage.

## Scaling Configuration

### Horizontal Pod Autoscaling

1. Create HPA for backend:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: testsage-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: testsage-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Database Scaling

1. Configure connection pooling:
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      idle-timeout: 300000
```

2. Set up read replicas if needed.

## Maintenance Procedures

### Rolling Updates

1. Update application version:
```bash
kubectl set image deployment/testsage-backend \
  testsage-backend=registry.example.com/testsage-backend:new-version
```

2. Monitor rollout:
```bash
kubectl rollout status deployment/testsage-backend
```

### Rollback Procedure

1. Rollback to previous version:
```bash
kubectl rollout undo deployment/testsage-backend
```

### Health Monitoring

1. Configure liveness probe:
```yaml
livenessProbe:
  httpGet:
    path: /actuator/health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
```

2. Configure readiness probe:
```yaml
readinessProbe:
  httpGet:
    path: /actuator/health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
```

## Troubleshooting

### Common Issues

1. Database Connection Issues:
```bash
kubectl logs deployment/testsage-backend
kubectl describe pod testsage-backend-xxx
```

2. Frontend 502 Errors:
```bash
kubectl logs deployment/testsage-frontend
kubectl describe ingress testsage-ingress
```

### Debug Mode

1. Enable debug logging:
```yaml
logging:
  level:
    com.testsage: DEBUG
```

2. Access debug endpoints:
```bash
kubectl port-forward service/testsage-backend 8080:8080
curl localhost:8080/actuator/health
```

## Security Considerations

1. Network Policies:
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: testsage-network-policy
spec:
  podSelector:
    matchLabels:
      app: testsage-backend
  policyTypes:
  - Ingress
  - Egress
```

2. Pod Security Policies
3. Regular security audits
4. Vulnerability scanning
