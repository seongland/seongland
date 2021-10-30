# Seongland Next

![image](https://user-images.githubusercontent.com/27716524/126918573-c8c824bc-70eb-4c8c-ab72-93867451394a.png)



## Philosophy

- Atomic Design Pattern
- Minimalism


## Made by
- Next js
- Windi CSS
- React Notion X
- React Three Fiber
- React Spring


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
okteto namespace
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

- [Next Windi](https://github.com/seonglae/next-windicss)
- [Nextplate](https://github.com/nextplate-dev/nextplate-chakra-ui)
- [Next Notion](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)
