const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function queryDatabase(databaseId, id) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            "filter": {
                "property": "ID",
                "unique_id": {
                    "equals": id
                }
            }
          });

        const ret = response.results.map((pages) => {
            return {       
                id: pages.properties["ID"].unique_id.number,         
                company: pages.properties["Company"].title[0].plain_text,
                campaign: pages.properties["Campaign"].rich_text[0].plain_text,
                description: pages.properties["Description"].rich_text[0].plain_text,
                planned_date: pages.properties["PlannedDate"].date.start,
                where: pages.properties["Where"].rich_text[0].plain_text,
                language: pages.properties["Language"].select.name,
                content: pages.properties["Content"].rich_text[0].plain_text,
                image_content: pages.properties["image content"].rich_text,
                image: pages.properties["Image"].files
            }
        });
        return ret;
    } catch (error){
        console.log(error.body);
    }
}

async function queryDatabase2(databaseId, username) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            "filter": {
                "property": "ID",
                "unique_id": {
                    "equals": username
                }
            }
          });  
        return response.results[0].id;
    } catch (error){
        console.log(error.body);
    }
}

async function deleteItem(databaseId, id) {
    try {
        await notion.databases.query({
            database_id: databaseId,
            "filter": {
                "property": "ID",
                "unique_id": {
                    "equals": id
                }
            }
        }).then(async pageId => {
            const response = await notion.blocks.delete({
                block_id: pageId.results[0].id,
            });
            console.log(response);
        })
    } catch (error) {
        console.log(error.body);
    }
}

deleteItem(databaseId, 256);