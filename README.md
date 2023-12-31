# compaon-service
## Required
- node
- yarn
- mysql

## Start project
- Create `.env` from the `.env.example` and fulfill all environment variables
- Run migration to create database structure
- Start project with command `yarn start:dev`
- Then, access http://localhost:3000/docs to check the result

## For dev
- Create DTO from openapi definition
  ```
  openapi-generator-cli generate -g typescript-nestjs -i path/to/openapi.yaml -o ./output --additional-properties=fileNaming=kebab-case,modelFileSuffix=.dto
  ```
- Check DTO in the `output/model` dir

- serve static file: http://localhost:3000/resources/filename


### STEP TO CREATE MIGRATION MODELS
- Create migrate file `yarn typeorm migration:create src/migrations/{dataFolderName}/scripts/{modelName}`

### START MIGRATION
- `yarn typeorm migration:run -d src/migrations/{datasourceConfigFile}/index.ts`


### REVERT MIGRATION
- `yarn typeorm migration:revert -d src/migrations/{datasourceConfigFile}/index.ts`

## Description convert between dto and entity

- DTO: communication between controller and service
- Entity: communication between service and repositorys
  ![alt text](https://i.imgur.com/LXGEXh3.png)
