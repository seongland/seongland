# Seongland
![image](https://user-images.githubusercontent.com/27716524/152371615-9dd137d2-81f7-4339-bca5-5f2fcca2d2eb.png)


## Philosophy

- Atomic Design Pattern
- Minimalism


## Made by
- Next js
- Windi CSS


## Build
```bash
VERSION=2.1.1
set -a; source .env; set +a
docker build  -t ghcr.io/seongland/seongland:$VERSION \
--build-arg GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS \
--build-arg GCLOUD_PROJECT=$GCLOUD_PROJECT \
--build-arg FIREBASE_COLLECTION_IMAGES=$FIREBASE_COLLECTION_IMAGES \
--build-arg NOTION_API_AUTH_TOKEN=$NOTION_API_AUTH_TOKEN \
.
docker push  ghcr.io/seongland/seongland:$VERSION
docker tag ghcr.io/seongland/seongland:$VERSION ghcr.io/seongland/seongland:latest
docker push  ghcr.io/seongland/seongland:latest

# deploy
okteto namespace seonglae
# deploy to current cluster
okteto stack deploy --wait
# if windows, change to default
kubectl config use-context docker-desktop
```

### Local
```bash
VERSION=2.1.1
docker-compose build
```



## Reference

- [Next Windi Template](https://github.com/seonglae/next-windicss)
