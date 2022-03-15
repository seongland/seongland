# Seongland

![image](https://user-images.githubusercontent.com/27716524/153127047-f2b9f817-650b-4b26-8b1f-9d093b7ca7e1.png)


## Philosophy

- Atomic Design Pattern
- Minimalism

## Made by

- Next js
- Windi CSS



## How to Contribute
### [Code Structure](https://app.codesee.io/maps/public/69f7dc50-7824-11ec-9a06-254b579c0ec0)
![Code Structure](https://user-images.githubusercontent.com/27716524/153126956-5aab4f44-066a-4666-a147-fedb4d15a238.png)

<p align="center">
  <a href="https://lgtm.com/projects/g/seongland/seongland/context:javascript"><img alt="Language grade: JavaScript" src="https://img.shields.io/lgtm/grade/javascript/g/seongland/seongland.svg?logo=lgtm&logoWidth=18"/></a>
<p>



## Docker Deploy

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

### Local Docker

```bash
VERSION=2.1.1
docker-compose build
```


## Reference

- [Next Windi](https://github.com/seonglae/next-windicss)
- [Nextplate](https://github.com/seonglae/nextra)
- [Next Notion](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)
