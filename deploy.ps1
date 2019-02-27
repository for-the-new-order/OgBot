[CmdletBinding()]
param (
    # [Parameter(Mandatory = $true)][string]$tag
    [string]$tag = "latest"
    # [Parameter(Mandatory = $true)][string]$containerRegistryName,
    # [Parameter(Mandatory = $true)][string]$containerDnsName,
    # [string]$resourceGroupName = "GAB2019Group",
    # [string]$location = "canadacentral",
    # [string]$imageName = "gabdemo",
    # [string]$containerName = "gab2019container"
)

az acr login --name fortheneworder

tsc
docker build --rm -f "Dockerfile" -t ogbot:$tag .
docker tag ogbot:$tag fortheneworder.azurecr.io/ogbot:$tag
docker push fortheneworder.azurecr.io/ogbot:$tag

az container create --resource-group for-the-new-order --name ogbot-container --image fortheneworder.azurecr.io/ogbot:$tag --dns-name-label ogbot --ports 80
az container show --resource-group for-the-new-order --name ogbot-container --query "{FQDN:ipAddress.fqdn,ProvisioningState:provisioningState}" --out table



