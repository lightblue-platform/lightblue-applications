package com.redhat.lightblue.applications;

import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.client.LaxRedirectStrategy;

public class LightblueHttpClient {

	public CloseableHttpClient getClient() {
		CloseableHttpClient httpclient = HttpClients.custom()
		.setRedirectStrategy(new LaxRedirectStrategy())
		.build();
		return httpclient;
	}
}
