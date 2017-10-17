package mvc.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import mvc.model.DAO;
import mvc.model.Tarefa;

@Controller
public class TarefasController {
	
	@RequestMapping("/")
	public String execute() {
		System.out.println("Lógica do MVC");
		return "info";
	}
	
	@RequestMapping(value = "storeImage", method = RequestMethod.POST)
	public void storeImage(
			@RequestParam("file") String file,
			@RequestParam("email") String email,
			@RequestParam("username") String username,
			@RequestParam("password") String password,
			HttpServletResponse response,HttpServletRequest request) throws ServletException, IOException{
		System.out.println(file);
		System.out.println(email);
		System.out.println(username);
		System.out.println(password);
		
		
		Tarefa usuario = new Tarefa();
		usuario.setName(username);
		usuario.setPassword(password);
		usuario.setEmail(email);
		usuario.setImage(file);
		
		DAO dao = new DAO();
		dao.adiciona(usuario);
		//MultipartFile image = file.
		//response.setContentType("image/jpeg, image/jpg, image/png, image/gif");
		//response.getOutputStream().write(dao.buscaFoto(login));
		//response.getOutputStream().close();
	}
	
	@RequestMapping("loginForm")
	public String loginForm() {
		return "formulario-login";
	}
	
	@RequestMapping("efetuaLogin")
	public String efetuaLogin(Tarefa login, HttpSession session) {
		if(new DAO().existeUsuario(login)) {
			session.setAttribute("usuarioLogado", login.getName());
			return "menu";
		}
		return "redirect:loginForm";
	}
	@RequestMapping("logout")
	public String logout(HttpSession session) {
		session.invalidate();
		return "redirect:loginForm";
	}
	
	@RequestMapping(value = "getImage", method = RequestMethod.GET)
	public void showImage(@RequestParam("login") String login, HttpServletResponse
			response,HttpServletRequest request)
					throws ServletException, IOException{
		DAO dao = new DAO();
		response.setContentType("image/jpeg, image/jpg, image/png, image/gif");
		response.getOutputStream().write(dao.buscaFoto(login));
		response.getOutputStream().close();
	}
	
	
	

}
