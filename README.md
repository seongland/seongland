# Seongland Next

![image](https://user-images.githubusercontent.com/27716524/126918573-c8c824bc-70eb-4c8c-ab72-93867451394a.png)

## Philosophy

- Atomic Design Pattern
- Minimalism

## Made by

- React Notion X
- React Three Fiber
- React Spring
- Next js

## Build

```bash
VERSION=2.0.6
set -a; source .env; set +a
docker build  -t ghcr.io/seongland/seongland:$VERSION \
--build-arg GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS \
--build-arg GCLOUD_PROJECT=$GCLOUD_PROJECT \
--build-arg FIREBASE_COLLECTION_IMAGES=$FIREBASE_COLLECTION_IMAGES \
.
docker push  ghcr.io/seongland/seongland:$VERSION
docker tag ghcr.io/seongland/seongland:$VERSION ghcr.io/seongland/seongland:latest
docker push  ghcr.io/seongland/seongland:latest
```

### local

```bash
VERSION=2.0.6
docker-compose build
```

### deploy

```bash
okteto stack deploy --wait
```

## Impressed by

- [Nextplate](https://github.com/nextplate-dev/nextplate-chakra-ui)
- [Next Notion](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)
