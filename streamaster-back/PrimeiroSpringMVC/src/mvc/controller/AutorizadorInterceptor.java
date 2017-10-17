package mvc.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class AutorizadorInterceptor extends HandlerInterceptorAdapter {

	@Override
		public boolean preHandle(HttpServletRequest request,
				HttpServletResponse response, Object controller) throws Exception {
		String uri = request.getRequestURI();
		if( uri.endsWith("register") ||
			uri.endsWith("efetuaRegistro") ||
			uri.endsWith("loginForm") ||
			uri.endsWith("efetuaLogin") ||
			uri.endsWith("storeImage") ||
			uri.endsWith("login") ||
			uri.endsWith("getImage") ) {
			return true;
		}
		if(request.getSession().getAttribute("usuarioLogado") != null) {
			 return true;
		}
		response.sendRedirect("loginForm");
		return false;
	}
}
