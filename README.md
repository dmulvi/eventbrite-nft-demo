# Eventbrite NFT Ticket + POAP Demo

This is a super simple demo app that accepts webhook requests from eventbrite. Upon signup an NFT is minted to the email address used during ticket checkout. The NFT will be minted to a [Crossmint](https://www.crossmint.com) custodial wallet. The webhook also watches for check-in events and will update the metadata of the NFT to a new image indicating the user attended. 
