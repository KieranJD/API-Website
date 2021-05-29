# Web API Development Back End
This is the back end API for the canine shelter

# Common Issue Fix:

Jwt tokens may not generate correctly.

To fix follow these steps:
- Delete both rsa_priv.pem and rsa_pub.pem files located in helpers folder
- In root of project run command 'node helpers/genKeyPair.js'
- Now rsa_priv.pem and rsa_pub.pem should have been re-generated
- Jwt tokens should now work 