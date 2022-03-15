# Register

```bash
kubectl config use-context cloud_okteto_com
kubectl config set-context --current --namespace seonglae
kubectl create secret docker-registry ghcred \
--docker-server="ghcr.io" \
--docker-username="$USER" \
--docker-password="$TOKEN" \
--docker-email="$EMAIL"
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "ghcred"}]}'
kubectl create secret generic seongland-secret --from-env-file=.env
```

# Deployment

change the image

```
kubectl apply -f seongland-deploy.yaml
```

# Local Build

```
GIT_TAG=`git describe --tags`
set -a; source .env; set +a
docker build  -t ghcr.io/seongland/seongland:$GIT_TAG \
--build-arg GIT_TAG=$GIT_TAG \
.
docker push  ghcr.io/seongland/seongland:$GIT_TAG
docker tag ghcr.io/seongland/seongland:$GIT_TAG ghcr.io/seongland/seongland:latest
docker push  ghcr.io/seongland/seongland:latest
```
