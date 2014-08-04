package com.redhat.lightblue.applications;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Properties;

import javax.servlet.Servlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.client.LaxRedirectStrategy;
import org.apache.http.util.EntityUtils;

public class LightblueRestRequest extends HttpServlet implements Servlet {

	private static final long serialVersionUID = 1L;

	private String serviceURI;
		
	private String serviceURI() throws IOException {
		if(serviceURI == null) {
			Properties properties = new Properties();
			properties.load(getClass().getClassLoader().getResourceAsStream("config.properties"));
			serviceURI = properties.getProperty("serviceURI");	
		}
		return serviceURI;
	}
	


	public void doGet(HttpServletRequest req, HttpServletResponse res)  throws IOException {
		HttpGet httpGet = new HttpGet(serviceURI(req.getRequestURI()));
		serviceCall(httpGet, req, res);
	}
	
	public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
		HttpPost httpPost = new HttpPost(serviceURI(req.getRequestURI()));
		httpPost.setEntity(new StringEntity(IOUtils.toString(req.getReader())));
		serviceCall(httpPost, req, res);
	}

	public void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException {
		HttpPut httpPut = new HttpPut(serviceURI(req.getRequestURI()));
		httpPut.setEntity(new StringEntity(IOUtils.toString(req.getReader())));
		serviceCall(httpPut, req, res);
	}

	public void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException {
		HttpDelete httpDelete = new HttpDelete(serviceURI(req.getRequestURI()));
		serviceCall(httpDelete, req, res);
	}
		
	private void serviceCall(HttpRequestBase httpOperation, HttpServletRequest req, HttpServletResponse res) throws IOException {
		res.setContentType("application/json");
		PrintWriter out = res.getWriter();
		try {
	    	CloseableHttpClient httpClient = getClient();
		httpOperation.setHeader("Content-Type", "application/json");
	    	
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

	private String serviceURI(String thisURI) throws IOException {
		return serviceURI() + thisURI.replace("/metadata-mgmt/rest-request", "");
	}
	
	private CloseableHttpClient getClient() throws Exception {
        CloseableHttpClient httpclient = HttpClients.custom()
                .setRedirectStrategy(new LaxRedirectStrategy())
                .build();
        
        return httpclient;
	}

}
