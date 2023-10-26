# IT314 Software Engineering

## Group 27

### Course Project Back-end Repository


#### Routes 
<table>
<thead>
<tr>
    <th> Router Endpoint </th>
    <th> Required Headers </th>
    <th> Body Format </th>
    <th> Description </th>
    <th> Response Payload Format </th>
</tr>
</thead>
<tbody>
<tr>
    <td>GET /auth </td>
    <td> Authorization: Bearer {token} </td>
    <td> </td>
    <td> Retrieve user _id from Token </td>
    <td> { user: { _id }} </td>
</tr>
<tr>
    <td>POST /auth </td>
    <td>  </td>
    <td> { auth: { email, password }} </td>
    <td> Authenticate user </td>
    <td>{ token, expires_in} </td>
</tr>
<tr>
    <td>GET /users </td>
    <td>  </td>
    <td>  </td>
    <td> Retrieve all users </td>
    <td>{ users: [_id] } </td>
</tr>
<tr>
    <td>GET /users/:id </td>
    <td>  </td>
    <td>  </td>
    <td> Retrieve user by id </td>
    <td>{ user: { _id, email, password }} </td>
</tr>
<tr>
    <td>POST /users/ </td>
    <td>  </td>
    <td> { user: { email, password }} </td>
    <td> Create new user </td>
    <td>{ user: { _id, email, password }} </td>
</tr>
<tr>
    <td>PUT /users/ </td>
    <td> Authorization: Bearer {token} </td>
    <td> { user: { email, password }} </td>
    <td> Update user </td> 
    <td>{ user: { _id, email, password }} </td>
</tr>
<tr>
    <td>DELETE /users/ </td>
    <td> Authorization: Bearer {token} </td>
    <td>  </td>
    <td> Delete user </td>
    <td> {} </td>
</tr>

</tbody>
</table>
