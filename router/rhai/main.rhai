// fn subgraph_service(service, subgraph) {
//     // let request_callback = Fn("process_request");
//     // service.map_request(request_callback);
//     let request_callback = |request| {
//         request.subgraph.body.extensions["claims"] = request.body.extensions["claims"];
//     };
//     service.map_request(request_callback);
// }

fn supergraph_service(service) {
    let request_callback = Fn("process_request");
    service.map_request(request_callback);
}

fn process_request(request) {
    // if supergraph_service do not block introspection query
    if request.context.operation_name == "IntrospectionQuery" {
        return;
    }

    let claims = request.context[Router.APOLLO_AUTHENTICATION_JWT_CLAIMS];
    if claims == () {
        throw #{
            status: 401,
            message: "Not authorized"
        };
    }

    // request.subgraph.body.extensions["claims"] = claims;
    request.body.extensions["claims"] = claims;

    let claim_names = ["user_id", "herp", "foo"];
    for claim_name in claim_names {
        let claim = claims[claim_name];
        claim = if claim == () {""} else {claim.to_string()};
        // request.subgraph.headers[claim_name] = claim;
        request.headers[claim_name] = claim;
    }
}
