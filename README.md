# eCommerce server

### Server structure

![](https://imgur.com/95faUsa.png)

| File name 　　　　　　　　　　　　　　| Description 　　　　　　　　<br><br>| 
| :--  | :--         |
| `├── .graphqlconfig.yml` | Configuration file based on [`graphql-config`](https://github.com/prisma/graphql-config) (e.g. used by GraphQL Playground).|
| `└── database ` (_directory_) | _Contains all files that are related to the Prisma database service_ |\
| `　　├── prisma.yml` | The root configuration file for your Prisma database service ([docs](https://www.prismagraphql.com/docs/reference/prisma.yml/overview-and-example-foatho8aip)) |
| `　　└── datamodel.graphql` | Defines your data model (written in [GraphQL SDL](https://blog.graph.cool/graphql-sdl-schema-definition-language-6755bcb9ce51)) |

### Git flow

| Name | Description |
| --- | --- |
| `@create(name)` | Creating new file/schema/layer |
| `@feature(<function>)` | Adding new functionality at the application level |
| `@refactor` | Code refactoring |
| `@update(<function>)` | Functionality Modifications |
| `@docs(<function>)` | Everything related to the documentation |
| `@style` | Correction of typos, formatting |
| `@test<function>` | Everything related to testing |
| `@chore` | Code Maintenance |
| `@remove(<function>)` | All that is related to deletion (functionality, modules, packages, etc.) |
| `@config(<module>)` | Configuration of the database, module, API, etc. |
| `@add/<name_module>` | Adding a module |
| `@update/<name_module>` | Updating the module |
| `@remove/<name_module>` | Removing Module |