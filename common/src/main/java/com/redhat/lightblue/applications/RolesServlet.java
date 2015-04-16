package com.redhat.lightblue.applications;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class RolesServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private static final String[] ROLES = new String[]{"authenticated", "lb-metadata-admin"};

    boolean noAuth = false;

    public void init(ServletConfig servletConfig) throws ServletException{
        String noAuthStr = servletConfig.getInitParameter("noAuth");
        if (noAuthStr != null && Boolean.parseBoolean(noAuthStr)) {
            noAuth = true;
        }
      }

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        List<String> userRoles = new ArrayList<>();

        for (String role : ROLES) {
            // if noAuth, give the user all roles defined in ROLES
            if (noAuth || req.isUserInRole(role)) {
                userRoles.add(role);
            }
        }

        resp.setContentType("application/javascript");
        resp.getOutputStream().println(toJavascript(userRoles));
        resp.getOutputStream().close();
    }

    // this is ugly, this is not scala...
    public static String toJavascript(List<String> list) {
        if (list == null || list.isEmpty()) {
            return "window.roles = [];";
        } else {
            return "window.roles = ['" + StringUtils.join(list, "', '") + "'];";
        }
    }

}
