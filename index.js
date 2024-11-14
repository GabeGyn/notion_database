const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

module.exports = queryDatabase;
async function queryDatabase(req, res) {
    
    const id = +req.url.split('/')[1];
    
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
                image_content: pages.properties["image content"].rich_text[0].plain_text,
                image: pages.properties["Image"].files[0].external.url
            }
        });
        
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(JSON.stringify(ret));
    } catch (error){
        console.log(error.body);
    }
}

module.exports = deleteItem;
async function deleteItem(req, res) {
    
    const id = +req.url.split('/')[1];

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
            await notion.blocks.delete({
                block_id: pageId.results[0].id,
            });
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Item deletado com suceso!');
        })
        
    } catch (error) {
        console.log(error.body);
    }
}

async function addToDatabase(company, content, campaign, description, where, language, image_content, image) {
    try {
        const response = await notion.pages.create({
            parent: {
                database_id: databaseId,
            },
            properties: {
                'Company' : {
                        type: 'title',
                        title: [
                        {
                            type: 'text',
                            text: {
                                content: company,
                            },
                        }
                        ],
                },
                'Campaign' : {
                    type: 'rich_text',
                    rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: campaign,
                        },
                    }
                    ],
                },
                'Content' : {
                    type: 'rich_text',
                    rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: content,
                        },
                    }
                    ],
                },
                'Description' : {
                    type: 'rich_text',
                    rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: description,
                        },
                    }
                    ],
                },
                'Where' : {
                    type: 'rich_text',
                    rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: where,
                        },
                    }
                    ],
                },
                'Language': {
                    type: 'select',
                    select: {
                        name: language
                    }
                },
                'PlannedDate': {
                    type: 'date',
                    date:{
                        start: '2022-02-14'
                    }
                },
                'image content' : {
                    type: 'rich_text',
                    rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: image_content,
                        },
                    }
                    ],
                },
                'Image': {
                    type: 'files',
                    files: [
                        {
                            name: "Image",
                            external: {
                              url: image
                            }
                          }
                    ]
                }
            }    
        });
        //console.log(response);
    } catch (error) {
        console.error(error.body);
    }
}

async function updateItem(databaseId, id, company, content, campaign, description, where, language, image_content, image) {    
    await notion.databases.query({
        database_id: databaseId,
        "filter": {
            "property": "ID",
            "unique_id": {
                "equals": id
            }
        }
    }).then(async pageId => {
        try {
            const response = await notion.pages.update({
                page_id: pageId.results[0].id,
                properties: {
                    'Company' : {
                            type: 'title',
                            title: [
                            {
                                type: 'text',
                                text: {
                                    content: company,
                                },
                            }
                            ],
                    },
                    'Campaign' : {
                        type: 'rich_text',
                        rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: campaign,
                            },
                        }
                        ],
                    },
                    'Content' : {
                        type: 'rich_text',
                        rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: content,
                            },
                        }
                        ],
                    },
                    'Description' : {
                        type: 'rich_text',
                        rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: description,
                            },
                        }
                        ],
                    },
                    'Where' : {
                        type: 'rich_text',
                        rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: where,
                            },
                        }
                        ],
                    },
                    'Language': {
                        type: 'select',
                        select: {
                            name: language
                        }
                    },
                    'PlannedDate': {
                        type: 'date',
                        date:{
                            start: '2022-02-14'
                        }
                    },
                    'image content' : {
                        type: 'rich_text',
                        rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: image_content,
                            },
                        }
                        ],
                    },
                    'Image': {
                        type: 'files',
                        files: [
                            {
                                name: "Image",
                                external: {
                                  url: image
                                }
                              }
                        ]
                    }
                },
                });
            //console.log(response);
        } catch (error) {
            console.log(error.body);
        }
    });
}