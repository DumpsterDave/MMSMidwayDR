# MMSMidwayDR
MMS Midway DR Examples

## Container App demo

A minimal Node.js app (no dependencies) that displays
`This app is running on <NAME>`, where `<NAME>` comes from the
`CONTAINER_APP_NAME` environment variable. Listens on port `8080`
and exposes `/health` (GET and HEAD) for health probes.

### Run locally

```sh
docker build -t mms-midway-dr .
docker run --rm -p 8080:8080 -e CONTAINER_APP_NAME=local-test mms-midway-dr
# browse to http://localhost:8080
```

### Deployment pipeline

[.github/workflows/deploy.yml](.github/workflows/deploy.yml) runs on every push
to `main` (or manually). It builds the image once, pushes it to Azure Container
Registry, then updates a primary and a secondary Container App (e.g. in
different regions) in parallel, setting `CONTAINER_APP_NAME` to each app's
name. If either app's variables are not set, that deployment is skipped.

Prerequisites (one-time, in Azure):

- An Azure Container Registry, and one or two Container Apps (with ingress on
  target port `8080`), each inside a Container Apps environment.
- Each Container App can pull from the ACR (e.g. managed identity with
  `AcrPull`).
- An Entra ID app registration / managed identity with a federated
  credential for this GitHub repo, holding `AcrPush` on the registry and
  `Contributor` on each Container App's resource group.

GitHub repository **secrets**:

| Name | Value |
| --- | --- |
| `AZURE_CLIENT_ID` | Client ID of the federated identity |
| `AZURE_TENANT_ID` | Entra tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Target subscription ID |

GitHub repository **variables**:

| Name | Value |
| --- | --- |
| `ACR_NAME` | Registry name (without `.azurecr.io`) |
| `PRIMARY_RESOURCE_GROUP` | Resource group of the primary Container App |
| `PRIMARY_CONTAINER_APP_NAME` | Name of the primary Container App |
| `SECONDARY_RESOURCE_GROUP` | Resource group of the secondary Container App |
| `SECONDARY_CONTAINER_APP_NAME` | Name of the secondary Container App |
