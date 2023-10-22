package kopo.poly.controller;

import kopo.poly.util.CmmUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Slf4j
@Controller
public class MainController {

    @GetMapping("/main")
    public String main(HttpSession session, ModelMap model) throws Exception {
        log.info(this.getClass().getName() + ".main 함수 실행");
        String userName = (String) session.getAttribute("SS_USER_NAME");
        model.addAttribute("userName", userName);
        return "main";
    }

    @GetMapping("/chart")
    public String chart() throws Exception {
        log.info(this.getClass().getName() + ".chart 함수 실행");
        return "chart";
    }

    @GetMapping("/redirect")
    public String redirectPage(HttpServletRequest request, ModelMap modelMap, HttpSession session) throws Exception {
        log.info(this.getClass().getName() + ".redirect 페이지 보여주는 함수 실행");

        String userName = (String) session.getAttribute("SS_USER_NAME");

        String msg = userName + "님 어서오세요!";

        modelMap.addAttribute("msg", msg);
        modelMap.addAttribute("url", "/main");

        return "/redirect";
    }

    @GetMapping("/redirect2")
    public String redirectPage2(HttpServletRequest request, ModelMap modelMap) throws Exception {
        log.info(this.getClass().getName() + ".redirect2 페이지 보여주는 함수 실행");
        String msg = CmmUtil.nvl(request.getParameter("msg"), "로그인 페이지로 이동합니다.");
        modelMap.addAttribute("msg", msg);
        return "/redirect2";
    }

    @GetMapping("/scan")
    public String scan(HttpSession session, ModelMap model) throws Exception {
        log.info(this.getClass().getName() + ".scan 함수 실행");
        String userName = (String) session.getAttribute("SS_USER_NAME");
        model.addAttribute("userName", userName);
        return "/scan";
    }

    @GetMapping("/gazami")
    public String intro() throws Exception {
        log.info(this.getClass().getName() + ".gazami 함수 실행");
        return "/gazami";
    }

}
