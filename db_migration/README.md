# DB MIGRATIONS ONLY FOR DEVELOP ENVIROMENT

### RUN LOCALLY

- Using typeorm-cli for migration data
- Run app
```
cd db_migration
yarn start:dev
```

### STEP TO CREATE MIGRATION MODELS
- Create migrate file `yarn typeorm migration:create src/migrations/{folderName}/{modelName}`

### START MIGRATION
- `yarn typeorm migration:run -d src/datasources/{datasourceConfigFile}.ts`


### REVERT MIGRATION
- `yarn typeorm migration:revert -d src/datasources/{datasourceConfigFile}.ts`
