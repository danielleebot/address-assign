# address-assign

## Local development

Start with development mode:

```bash
pnpm run start:dev
```

Start with production mode:

```bash
pnpm run start:prod
```

Format code:

```bash
pnpm run format
```

Lint code:

```bash
pnpm run lint
```

Build code:

```bash
pnpm run build
```

## Swagger

View documentation in browser: <http://localhost:8080>

## Deploy to Google Cloud Run

1. Create a firestore native database

   ```bash
   gcloud alpha firestore databases create \
     --database= \
     --location=eur3 \
     --type=firestore-native \
     --delete-protection
   ```

2. Create a key ring

   ```bash
   gcloud kms keyrings create alpha-keyring-001 \
     --location europe-west1
   ```

3. Create a symmetric encryption key

   ```bash
   gcloud kms keys create alpha-001 \
     --keyring alpha-keyring-001 \
     --location europe-west1 \
     --purpose "encryption" \
     --protection-level "hsm"
   ```

4. Prepare Dockerfile for Cloud Build

5. Deploy to Cloud Run

   ```bash
   gcloud run deploy --source . --region europe-west1 \
     --set-env-vars "NODE_ENV=production" \
     --set-env-vars "FIRESTORE_DATABASE_ID=" \
     --set-env-vars "KMS_PROJECT_ID=" \
     --set-env-vars "KMS_LOCATION_ID=" \
     --set-env-vars "KMS_KEY_RING_ID=" \
     --set-env-vars "KMS_KEY_ID=1"
   ```

## References

- [Manage databases - Firestore](https://cloud.google.com/firestore/docs/manage-databases)

- [Create a key ring - Cloud Key Management Service](https://cloud.google.com/kms/docs/create-key-ring#kms-create-key-ring-gcloud)

- [Create a key - Cloud Key Management Service](https://cloud.google.com/kms/docs/create-key)

- [Deploying to Cloud Run](https://cloud.google.com/run/docs/deploying)
