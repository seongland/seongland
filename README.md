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

## How to Contribute
### Code Structure
[![Code Structure](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/459f657f-fea7-4097-8469-bd23da5d5d53/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220118%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220118T061200Z&X-Amz-Expires=86400&X-Amz-Signature=63492fc81b55b685b9a086368b87d1263ef9ad48ddb031f273860d88ffa7065e&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)](https://app.codesee.io/maps/public/69f7dc50-7824-11ec-9a06-254b579c0ec0)




## Reference

- [Next Windi](https://github.com/seonglae/next-windicss)
- [Nextplate](https://github.com/nextplate-dev/nextplate-chakra-ui)
- [Next Notion](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)
