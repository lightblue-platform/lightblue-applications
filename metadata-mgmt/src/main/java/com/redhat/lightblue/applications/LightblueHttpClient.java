package com.redhat.lightblue.applications;

import java.security.GeneralSecurityException;

import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLContextBuilder;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.client.LaxRedirectStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LightblueHttpClient {

	private final Logger LOGGER = LoggerFactory.getLogger(LightblueHttpClient.class);
	
    public CloseableHttpClient getClient() {
    	CloseableHttpClient httpClient = null;
    	SSLConnectionSocketFactory sslsf = null;
    	try {
    		SSLContextBuilder builder = new SSLContextBuilder();
            builder.loadTrustMaterial(null, new TrustSelfSignedStrategy());
            sslsf = new SSLConnectionSocketFactory(
                    builder.build());	
            
            httpClient = HttpClients.custom()
                    .setRedirectStrategy(new LaxRedirectStrategy())
                    .setSSLSocketFactory(sslsf)
                    .build();
    	} catch (GeneralSecurityException e) {
    		LOGGER.error("Error creating jks from certificates: ", e);
            throw new RuntimeException(e);
    	}
        return httpClient;
    }
}
