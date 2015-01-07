package com.redhat.lightblue.applications.data;

import com.redhat.lightblue.client.LightblueClientConfiguration;
import com.redhat.lightblue.client.PropertiesLightblueClientConfiguration;
import com.redhat.lightblue.client.http.auth.ApacheHttpClients;

import org.apache.http.impl.client.CloseableHttpClient;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Disposes;
import javax.enterprise.inject.Produces;
import java.io.IOException;

public class ApplicationContext {
    @Produces @ApplicationScoped
    public LightblueClientConfiguration getLightblueClientConfiguration() {
        return PropertiesLightblueClientConfiguration.fromDefault();
    }

    @Produces @ApplicationScoped
    public CloseableHttpClient getClient(LightblueClientConfiguration config) throws Exception {
        return ApacheHttpClients.fromLightblueClientConfiguration(config);
    }

    public void closeHttpClient(@Disposes CloseableHttpClient client) throws IOException {
        client.close();
    }
}
