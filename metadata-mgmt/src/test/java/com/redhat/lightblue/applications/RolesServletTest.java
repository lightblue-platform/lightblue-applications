package com.redhat.lightblue.applications;

import java.util.Arrays;
import java.util.List;

import org.junit.Assert;
import org.junit.Test;

public class RolesServletTest {

	@Test
	public void testRolesArray() {
		List<String> empty = Arrays.asList(new String[]{});
		Assert.assertEquals("var roles = [];", RolesServlet.toJavascript(empty));

		List<String> oneElement = Arrays.asList(new String[]{"user-admin"});
		Assert.assertEquals("var roles = ['user-admin'];", RolesServlet.toJavascript(oneElement));

		List<String> multipleElements = Arrays.asList(new String[]{"user-admin", "authenticated"});
		Assert.assertEquals("var roles = ['user-admin', 'authenticated'];", RolesServlet.toJavascript(multipleElements));
	}

}
