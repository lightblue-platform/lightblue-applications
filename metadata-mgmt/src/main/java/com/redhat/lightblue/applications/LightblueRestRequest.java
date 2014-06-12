package com.redhat.lightblue.applications;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.Servlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.client.LaxRedirectStrategy;
import org.apache.http.util.EntityUtils;

public class LightblueRestRequest extends HttpServlet implements Servlet {

	private static final long serialVersionUID = 1L;

	private String serviceURI = "http://localhost:8080/metadata";
	
	public void doGet(HttpServletRequest req, HttpServletResponse res)  throws IOException {
		HttpGet httpGet = new HttpGet(serviceURI(req.getRequestURI()));
		serviceCall(httpGet, req, res);
	}
	
	public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
		HttpPost httpPost = new HttpPost(serviceURI(req.getRequestURI()));
		serviceCall(httpPost, req, res);
	}
		
	private void serviceCall(HttpRequestBase httpOperation, HttpServletRequest req, HttpServletResponse res) throws IOException {
		res.setContentType("application/json");
		PrintWriter out = res.getWriter();
		try {
	    	CloseableHttpClient httpClient = getClient();
	    	
	    	CloseableHttpResponse httpResponse = httpClient.execute(httpOperation);
	    	HttpEntity entity = httpResponse.getEntity();
	    	out.println(EntityUtils.toString(entity));
	    	
	    	httpResponse.close();
	    	httpClient.close();
		} catch (Exception e) {
			out.println("Something bad happened");
			e.printStackTrace();
		}
	}

	private String serviceURI(String thisURI) {
		return serviceURI + thisURI.replace("/metadata-mgmt/rest-request", "");
	}
	
	private CloseableHttpClient getClient() throws Exception {
        CloseableHttpClient httpclient = HttpClients.custom()
                .setRedirectStrategy(new LaxRedirectStrategy())
                .build();
        
        return httpclient;
	}

}
