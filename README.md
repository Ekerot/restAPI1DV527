# dekes03-examination-2

Before using the api use this line to set the enviormental variable for the JWT secret:

`export TOKEN=whateveryoulike`

Then just start the API with: 

`node server.js`

##How have you implemented the idea of HATEOAS in your API?
I have made Hyperlinkish look att my json-files:

```
_links: {
         self: [{
                href: 'http://localhost:3000/api/v1/register',
                type: 'application/json',
                rel: 'next',
                verb: 'POST',
                title: 'Register a user'
                }],
         from: [{
                href: 'http://localhost:3000/api/v1',
                type: 'application/json',
                rel: 'self',
                verb: 'GET',
                title: 'This is the API root!'
                }]
         }
```

My API does then return links to related resources and you will be able to manuver entierly through the API. 
I looked around a lot to find out how the hyperlink looked like and how others had impplemented it in JSON. I then settled to use the on that looked the best and tweak it so that i worked for my API.  
In my humble opinion my API does a good job to navigate with only the respons from the API and it is self explaining.

##If your solution should implement multiple representations of the resources.
I´ not really shure what you want us explain, but my interpretation is that you want us to 
explain how we would do if it is possible to fetch different representations of the resources through different filters. 
For example: getCatchesByFisherman or getCatchesByFishType. 

I would use querystrings:

`api/v1/catches/catches?fields=username`

It is simple to read and you can get the selected data in an easy way at a given time. After reading  it also looked like the most vrefered in the community.

##Motivate and defend your authentication solution? 
I choose to use tokens in this assignment. I used oauth before and though this is for learning i choose JWT.
JWT seams like it is perfect for stateless request even though it has some drawbacks. There is no need for the user to have a maintained session for the API, in this way JWT works like a charm. 
Instead it sends the authentication token with each and every request. I really liked to work with it though it is so simple and straight forward to use. In an API like this I think that it is a really good way to approach the authentication in the API. 


Pro:
*   Statles
*   Do not need implementation of DBS
*   Cross-domain
*   Statless
*   Mobile ready
*   Simple to use

Cons: 
*   Easy to decrypt
*   Do not "speak" with client -  no way to identify the client
*   If key is leaked anyone can use it so the whole API can be compromised

 
##Explain how your web hook works.
My webhook sends out the data of new created when data is created, changed and deleted in the API. I have my own route/lib for the webhook, I wasn´ sure where to put it but I guess I will know when I get your respons).

##Since this is your first own web API there are probably things you would solve in an other way looking back at this assignment. 
Well, I would like to use the Restify framwork to try it out. Not that it was any problem using Express but it would be fun to use Restify though it is specialized to help you build restAPI:s.
There is also a lot of small things I would change and that I changed during the development but all in all I feel that my rest is OK and I´ happy with it for now.

##Did you do something extra besides the fundamental requirements?

*   I did use version handeling though in the URL which is questionable(but every body does so ;-))
*   I have implemented admin role to access user information