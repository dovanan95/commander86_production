#An Do, [21. 12. 15. AM 4:30]
#stay in test-network
cd ../fabcar
./networkDown.sh
cd ../test-network
./network.sh down
./network.sh up createChannel -ca -s couchdb
cd addOrg3/
./addOrg3.sh up -c mychannel -ca -s couchdb
cd ..
./network.sh deployCC -ccn fabcar -ccv 1 -cci initLedger -ccl javascript  -ccp ../chaincode/fabcar/javascript/ -ccep "AND('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer')"
cd ../fabcar/javascript/
node enrollAdmin.js
node registerUser.js
npm install
npm install express
npm install multer
npm install ejs
npm install jsonwebtoken
npm install dotenv
npm install mongodb
npm install mssql
docker update --restart unless-stopped $(docker ps -q)
#

#xem block 
docker logs peer0.org0.example.com -f


#binary fetch
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/

# Environment variables for Org1

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

#to take permission to use file in directory
/directory/:$ chmod +x <file_name>

#version pull command
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.4.0

#access docker container
docker exec -it peer0.org1.example.com sh

#kill and restart peer and couchdb

docker kill peer0.org1.example.com
docker kill couchdb0

SOCK="${DOCKER_HOST:-/var/run/docker.sock}"
DOCKER_SOCK="${SOCK##unix://}"
DOCKER_SOCK="${DOCKER_SOCK}"  docker-compose -f docker/docker-compose-test-net.yaml -f docker/docker-compose-couch.yaml up -d peer0.org1.example.com couchdb0


#sql server ubuntu
sqlcmd -S localhost -U SA -P '<YourPassword>'
sqlcmd -S localhost -U SA -P '<YourPassword>' -i sqlfilename.sql