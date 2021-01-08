import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //This is Appsync graphql Api for lambda function
    const bookmark_API = new appsync.GraphqlApi(this, 'Api', {
      name: 'cdk-bookmark-appsync-api',
      schema: appsync.Schema.fromAsset('schema/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
    });


    //This is lambda function
    const bookmarkLambda = new lambda.Function(this, 'AppSyncBookmarkHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('functions')
    });

    //Here we define our Datasource
    const lambdaDs = bookmark_API.addLambdaDataSource('lambdaDatasource', bookmarkLambda);

    //Here we define Dynamodb construct
    const bookmarkTable = new dynamodb.Table(this, 'BookmarkTable', {
      tableName: "BookmarkTable",
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });
    bookmarkTable.grantFullAccess(bookmarkLambda);
    bookmarkLambda.addEnvironment('BOOKMARK_TABLE', bookmarkTable.tableName);

    //Here we define resolvers for queries and for mutations
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getBookmark"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addBookmark"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteBookmark"
    });

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: bookmark_API.graphqlUrl
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: bookmark_API.apiKey || ''
    });

    //define s3 bucket 
    const bookmarkBucket = new s3.Bucket(this, "bookmarkBucket", {
      versioned: true,
    });

    bookmarkBucket.grantPublicAccess(); // website visible to all.

    // create a CDN to deploy your website
    const distribution = new cloudfront.Distribution(this, "bookmarkDistribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(bookmarkBucket),
      },
      defaultRootObject: "index.html",
    });


    // Prints out the web endpoint to the terminal
    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.domainName,
    });


    // housekeeping for uploading the data in bucket 
    new s3deploy.BucketDeployment(this, "DeploybookmarkApp", {
      sources: [s3deploy.Source.asset("../bookmark-frontend/public")],
      destinationBucket: bookmarkBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}