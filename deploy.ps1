# Deploy the Docker image to DockerHub
[CmdletBinding()]
param (
    [string]$tag = "auto"
)

if ($tag -eq "auto"){
    $tag = (Get-Content package.json) -join "`n" | ConvertFrom-Json | Select -ExpandProperty "version"
}
Write-Output "tag: $tag"

docker login -u carlhugo

#tsc
docker build --rm -f "Dockerfile" -t ogbot:$tag .
docker tag ogbot:$tag carlhugo/ogbot:$tag
docker push carlhugo/ogbot:$tag
