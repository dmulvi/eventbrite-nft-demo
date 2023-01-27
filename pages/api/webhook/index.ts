import { NextApiResponse, NextApiRequest } from 'next'
const fetch = require('node-fetch');

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  
  console.log('body:', _req.body);

  const action = _req.body?.config?.action;
  const url = _req.body.api_url;
  const data = await getOrderInfo(url);

  const { email, id, order_id } = data; 
  
  if (action === 'order.placed') {
    mintNFT(email, id);
  }
  else if (action === 'barcode.checked_in') {
    updateNFT(order_id);
  }

  // return a 200 like every good webhook should
  return res.status(200).send(_req.body)
}

async function getOrderInfo(url) {
  const response = await fetch(`${url}?token=${process.env.EVENTBRITE_API_TOKEN}`);
  return await response.json();
}

function mintNFT(email: String, id: String) {
  const url = `https://staging.crossmint.com/api/2022-06-09/collections/default-solana/nfts/${id}`;
  const options = {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'x-client-secret': process.env.API_SECRET,
      'x-project-id': process.env.PROJECT_ID
    },
    body: JSON.stringify({
      recipient: `email:${email}:solana`,
      metadata: {
        name: 'Crossmint Minting API Workshop',
        image: 'https://bafkreidnrorv2m23ckc3agqs7dyljeqx25vjwq5ozvixj4fujls6ms6zmy.ipfs.nftstorage.link/',
        description: 'Your ticket to the event',
        attributes: [{trait_type: 'attended', value: 'false'}]
      },
      reuploadLinkedFiles: false
    })
  };

  fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error('error:' + err));
}

function updateNFT(id: String) {
  const url = `https://staging.crossmint.com/api/2022-06-09/collections/default-solana/nfts/${id}`;
  const options = {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      'x-client-secret': process.env.API_SECRET,
      'x-project-id': process.env.PROJECT_ID
    },
    body: JSON.stringify({
      metadata: {
        name: 'Crossmint Minting API Workshop',
        image: 'https://bafybeifgrficp7wjusys4rxfy3tcvljfgvwpiclom7lscgnzi7njlbtaeq.ipfs.nftstorage.link/',
        description: 'Your proof of attendence for the Solana Spaces x Crossmint Minting API Workshop',
        attributes: [{trait_type: 'attended', value: 'true'}]
      },
      reuploadLinkedFiles: false
    })
  };

  fetch(url, options)
    .then(res => console.log(`updated NFT with id: ${id}`))
    .catch(err => console.error('error:' + err));
}