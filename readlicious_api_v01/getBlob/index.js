const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');
require('dotenv').config()


module.exports = async function (context, req) {
    console.log('Azure Blob storage v12');

    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!AZURE_STORAGE_CONNECTION_STRING) {
        throw Error("Azure Storage Connection string not found");
    }

    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

    //const containerName = "readlicious-blob-container";

    // Get a reference to a container
    //const containerClient = blobServiceClient.getContainerClient(containerName);

    // To Upload blobs to blob storage 
    // Create a unique name for the blob
    //const blobName = "coisa";

    //const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    /*   
    --- Upload data to the blob
    const data = "Hello, World!";
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
    console.log(
        "Blob was uploaded successfully. requestId: ",
        uploadBlobResponse.requestId
    );
    
    --- Download blobs from blob
    // Get blob content from position 0 to the end
    // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
    // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    console.log("\nDownloaded blob content...");
    console.log( "\t", await streamToText(downloadBlockBlobResponse.readableStreamBody));

    --- Convert stream to text
    async function streamToText(readable) {
    readable.setEncoding('utf8');
    let data = '';
    for await (const chunk of readable) {
      data += chunk;
    }
    return data;
    }

    --- Delete container
    // Delete container
    console.log("\nDeleting container...");

    const deleteContainerResponse = await containerClient.delete();
    console.log("Container was deleted successfully. requestId: ", deleteContainerResponse.requestId);

    */

    //console.log("\nListing blobs...");

    // List the blob(s) in the container.
    //for await (const blob of containerClient.listBlobsFlat()) {
    //    console.log("\t", blob.name);
    //}


    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}