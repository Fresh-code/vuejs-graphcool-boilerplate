#!/bin/bash
env=$1
cluster=$2

if [ -z ${env} ]; then env="dev"; fi
if [ -z ${cluster} ]; then cluster="local"; fi
if [ -z ${GRAPHCOOL_SERVICE_NAME} ]; then GRAPHCOOL_SERVICE_NAME="$(basename $(pwd))"; fi
if [ -z ${GC_MASTER_TOKEN} ]; then GC_MASTER_TOKEN="MuchTokenSuchMasterWow"; fi

echo "Environment: ${env}"
echo "Cluster: ${cluster}"
echo "Service name: ${GRAPHCOOL_SERVICE_NAME}"

# take Graphcool URL from ~/.grapcoolrc (use host of corresponding cluster)
GRAPHCOOL_URL=$(grep " "${cluster}":" ~/.graphcoolrc -A 1 | tail -1 | sed -r "s/.*'(.*)'.*/\1/g")
GRAPHCOOL_ADDRESS=$(echo ${GRAPHCOOL_URL} | sed 's/https\?:\/\///')

if [ "$env" == "dev" ]; then
  storagePath=$(pwd)/server;
else
  storagePath=/opt/graphcool/${GRAPHCOOL_SERVICE_NAME};
fi

cd server/

# if service is already created
if [ -s ${storagePath}/.graphcoolrc ]; then
  echo "Deploy service..."
  # copy deploy settings back from storage volume
  if [ "$env" != "dev" ]; then
    cp ${storagePath}/.graphcoolrc .graphcoolrc
    cp ${storagePath}/.env ../.env
  fi
  # deploy graphcool service (force schema changes)
  graphcool deploy --force -t ${env} -c ${cluster}
else
  # otherwise
  # retrieve cluster secret from Graphcool
  if [ "$env" != "dev" ]; then
    /opt/wait-for-it.sh ${GRAPHCOOL_ADDRESS} --strict --timeout=600 -- echo "Graphcool started!"
    echo "Retrieve and set Graphcool cluster secret..."
    clusterSecret=$(curl ${GRAPHCOOL_URL}'/system' -H 'Content-Type: application/json' -d '{"query":"mutation {authenticateCustomer(input:{auth0IdToken:\"'${GC_MASTER_TOKEN}'\"}){token, user{id}}}"}' -sS | grep -Po '(?<="token":").*?[^\\](?=",)')
    sed -i 's/${CLUSTER_SECRET}/'${clusterSecret}'/g' ~/.graphcoolrc
  fi
  echo "Init and deploy service..."
  # create graphcool service
  graphcool deploy --force -t ${env} -c ${cluster} -n ${GRAPHCOOL_SERVICE_NAME}
  echo "Retrieve endpoint..."
  # get graphcool endpoint address
  links=$(graphcool info | grep Simple)
  api=${links:7}
  echo "Endpoint: ${api}"
  #echo "Retrieve main token..."
  #mainToken=$(graphcool root-token main-token)
  #echo "Main token: ${mainToken:0:37}***"
  echo -e "ROOT_TOKEN=$mainToken\nSIMPLE_API=${api//[[:blank:]]/}" > "../.env"

  # copy deploy settings into storage volume
  if [ "$env" != "dev" ]; then
    mkdir -p ${storagePath}
    cp .graphcoolrc ${storagePath}/.graphcoolrc
    cp ../.env ${storagePath}/.env;
  fi
fi
