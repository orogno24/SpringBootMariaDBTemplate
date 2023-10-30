package kopo.poly.controller;

import kopo.poly.dto.MsgDTO;
import kopo.poly.dto.UserInfoDTO;
import kopo.poly.service.IUserInfoService;
import kopo.poly.util.CmmUtil;
import kopo.poly.util.EncryptUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Optional;

@Slf4j
@RequestMapping(value = "/user")
@RequiredArgsConstructor
@Controller
public class UserInfoController {

    private final IUserInfoService userInfoService; // 서비스는 모든 컨트롤러 함수에서 실행시킬 수 있어야 하므로 전역변수로 선언함.

    /**
     * 회원가입 화면으로 이동!
     */
    @GetMapping(value = "userRegForm")      // 회원가입
    public String userRegForm() {
        log.info(this.getClass().getName() + ".userRegForm");

        return "user/userRegForm";
    }

    @GetMapping("/profile")                    // 개인정보 수정 페이지
    public String profile(HttpSession session, ModelMap model) throws Exception {
        log.info(this.getClass().getName() + ".profile 함수 실행");
        String userId = CmmUtil.nvl((String) session.getAttribute("SS_USER_ID"));

        log.info("프로필 userId : " + userId);

        UserInfoDTO pDTO = new UserInfoDTO();
        pDTO.setUserId(userId);

        UserInfoDTO rDTO = Optional.ofNullable(userInfoService.getGrade(pDTO))
                .orElseGet(UserInfoDTO::new);

        log.info("grade : " + rDTO.getGrade());

        model.addAttribute("rDTO", rDTO);

        return "user/profile";
    }

    @GetMapping(value = "login")            // 로그인
    public String login() {
        log.info(this.getClass().getName() + ".user/login Start!");

        return "/user/login";
    }

    @ResponseBody
    @PostMapping(value = "loginProc")       // 로그인함수.
    public MsgDTO loginProc(HttpServletRequest request, HttpSession session) {
        log.info(this.getClass().getName() + ".loginProc Start!");

        int res = 0;
        String msg = "";
        MsgDTO dto = null;

        UserInfoDTO pDTO = null;

        try {
            String userId = CmmUtil.nvl(request.getParameter("userId"));
            String password = CmmUtil.nvl(request.getParameter("password"));

            log.info("userId : " + userId);
            log.info("password : " + password);

            pDTO = new UserInfoDTO();

            pDTO.setUserId(userId);

            pDTO.setPassword(EncryptUtil.encHashSHA256(password));

            UserInfoDTO rDTO = userInfoService.getLogin(pDTO);

            if (CmmUtil.nvl(rDTO.getUserId()).length() > 0) {

                res = 1;

                // msg = "로그인이 성공했습니다.";

                session.setAttribute("SS_USER_ID", userId);
                session.setAttribute("SS_USER_NAME", CmmUtil.nvl(rDTO.getUserName()));
            } else {
                msg = "아이디와 비밀번호가 올바르지 않습니다.";
            }
        } catch (Exception e) {
            msg = "시스템 문제로 로그인이 실패했습니다.";
            res = 2;
            log.info(e.toString());
            e.printStackTrace();
        } finally {
            dto = new MsgDTO();
            dto.setResult(res);
            dto.setMsg(msg);

            log.info(this.getClass().getName() + ".loginProc End!");
        }
        return dto;
    }

    @ResponseBody
    @PostMapping(value = "insertUserInfo")      // 회원가입 정보 등록
    public MsgDTO insertUserInfo(HttpServletRequest request) throws Exception {

        log.info(this.getClass().getName() + ".insertUserInfo 시작!");

        int res = 0;
        String msg = "";
        MsgDTO dto = null;

        UserInfoDTO pDTO = null;

        try {
            String userId = CmmUtil.nvl(request.getParameter("userId"));
            String password = CmmUtil.nvl(request.getParameter("password"));
            String email = CmmUtil.nvl(request.getParameter("email"));
            String userName = CmmUtil.nvl(request.getParameter("userName"));

            log.info("userId : " + userId);
            log.info("password : " + password);
            log.info("email : " + email);
            log.info("userName : " + userName);

            pDTO = new UserInfoDTO();

            pDTO.setUserId(userId);
            pDTO.setPassword(EncryptUtil.encHashSHA256(password));
            pDTO.setEmail(EncryptUtil.encAES128CBC(email));
            pDTO.setUserName(userName);

            res = userInfoService.insertUserInfo(pDTO);

            log.info("회원가입 결과(res) : " + res);

            if (res == 1) {
                msg = "회원가입되었습니다.";
            } else if (res == 2) {
                msg = "이미 가입된 아이디입니다.";
            } else {
                msg = "오류로 인해 회원가입이 실패하였습니다.";
            }
        } catch (Exception e) {

            msg = "실패하였습니다. : " + e;
            log.info(e.toString());
            e.printStackTrace();
        } finally {
            dto = new MsgDTO();
            dto.setResult(res);
            dto.setMsg(msg);

            log.info(this.getClass().getName() + ".insertUserInfo 끝!");
        }

        return dto;
    }

    @GetMapping(value = "searchUserId")         // 아이디 찾기
    public String searchUserId() {
        log.info(this.getClass().getName() + ".user/searchUserId Start!");

        log.info(this.getClass().getName() + ".user/searchUserId End!");

        return "/user/searchUserId";
    }

    @PostMapping(value = "searchUserIdProc")        // 아이디 찾기 함수
    public String searchUserIdProc(HttpServletRequest request, ModelMap model) throws Exception {

        log.info(this.getClass().getName() + ".user/searchUserIdProc Start!");

        String userName = CmmUtil.nvl(request.getParameter("userName"));
        String email = CmmUtil.nvl(request.getParameter("email"));

        log.info("userName : " + userName);
        log.info("email : " + email);

        UserInfoDTO pDTO = new UserInfoDTO();
        pDTO.setUserName(userName);
        pDTO.setEmail(EncryptUtil.encAES128CBC(email));

        log.info("pDTO userName: " + userName);
        log.info("pDTO email : " + email);

        UserInfoDTO rDTO = Optional.ofNullable(userInfoService.searchUserIdOrPasswordProc(pDTO))
                .orElseGet(UserInfoDTO::new);

        log.info("rDTO userId : " + rDTO.getUserId());
        log.info("rDTO email : " + rDTO.getEmail());

        model.addAttribute("rDTO", rDTO);

        log.info(this.getClass().getName() + ".user/searchUserIdProc End!");

        return "/user/searchUserIdResult";
    }

    @GetMapping(value = "searchPassword")           // 비밀번호 찾기
    public String searchPassword(HttpSession session) {
        log.info(this.getClass().getName() + ".user/searchPassword Start!");

        session.setAttribute("NEW_PASSWORD", "");
        session.removeAttribute("NEW_PASSWORD");

        log.info(this.getClass().getName() + ".user/searchPassword End!");

        return "/user/searchPassword";
    }

    @PostMapping(value = "searchPasswordProc")
    public String searchPasswordProc(HttpServletRequest request, ModelMap model, HttpSession session) throws Exception {
        log.info(this.getClass().getName() + ".user/searchPasswordProc start!");

        String userId = CmmUtil.nvl(request.getParameter("userId"));
        String userName = CmmUtil.nvl(request.getParameter("userName"));
        String email = CmmUtil.nvl(request.getParameter("email"));

        log.info("userId : " + userId);
        log.info("userName : " + userName);
        log.info("email : " + email);

        UserInfoDTO pDTO = new UserInfoDTO();
        pDTO.setUserId(userId);
        pDTO.setUserName(userName);
        pDTO.setEmail(EncryptUtil.encAES128CBC(email));

        UserInfoDTO rDTO = Optional.ofNullable(userInfoService.searchUserIdOrPasswordProc(pDTO)).orElseGet(UserInfoDTO::new);

        model.addAttribute("rDTO", rDTO);

        session.setAttribute("NEW_PASSWORD", userId);

        log.info(this.getClass().getName() + ".user/searchPasswordProc end!");

        return "/user/newPassword";
    }
    @ResponseBody
    @PostMapping(value = "newPasswordProc")
    public MsgDTO newPasswordProc(HttpServletRequest request, HttpSession session) throws Exception {
        log.info(this.getClass().getName() + ".user/newPasswordProc Start!");
        String msg = "";
        MsgDTO dto = null;

        String newPassword = CmmUtil.nvl((String) session.getAttribute("NEW_PASSWORD"));

        if (newPassword.length() > 0) {
        try {
            String password = CmmUtil.nvl(request.getParameter("password"));

            log.info("password : " + password);

            UserInfoDTO pDTO = new UserInfoDTO();
            pDTO.setUserId(newPassword);
            pDTO.setPassword(EncryptUtil.encHashSHA256(password));

            userInfoService.newPasswordProc(pDTO);

            session.setAttribute("NEW_PASSWORD", "");
            session.removeAttribute("NEW_PASSWORD");

            msg = "비밀번호가 재설정되었습니다.";
        } catch (Exception e) {
            msg = "실패하였습니다. : " + e.getMessage();
            log.info(e.toString());
            e.printStackTrace();

        } finally {
            // 결과 메시지 전달하기
            dto = new MsgDTO();
            dto.setMsg(msg);

            log.info(this.getClass().getName() + ".newPasswordProc End!");
        }}

        return dto;
    }

    @ResponseBody
    @PostMapping(value = "getUserIdExists")         // 아이디 중복찾기
    public UserInfoDTO getUserExists(HttpServletRequest request) throws Exception {

        log.info(this.getClass().getName() + ".getUserIdExists 시작!");

        String userId = CmmUtil.nvl(request.getParameter("userId"));

        log.info("userId : " + userId);

        UserInfoDTO pDTO = new UserInfoDTO();
        pDTO.setUserId(userId);

        UserInfoDTO rDTO = Optional.ofNullable(userInfoService.getUserIdExists(pDTO)).orElseGet(UserInfoDTO::new);

        log.info(this.getClass().getName() + ".getUserIdExists 끝!");

        return rDTO;
    }

    @ResponseBody
    @PostMapping(value = "getUserNameExists")       // 닉네임 중복찾기
    public UserInfoDTO getUserNameExists(HttpServletRequest request) throws Exception {

        log.info(this.getClass().getName() + ".getUserNameExists 시작!");

        String userName = CmmUtil.nvl(request.getParameter("userName"));

        log.info("userName : " + userName);

        UserInfoDTO pDTO = new UserInfoDTO();
        pDTO.setUserName(userName);

        log.info(pDTO.getUserName());

        UserInfoDTO rDTO = Optional.ofNullable(userInfoService.getUserNameExists(pDTO)).orElseGet(UserInfoDTO::new);

        log.info(rDTO.getExistsYn());

        log.info(this.getClass().getName() + ".getUserNameExists 끝!");

        return rDTO;
    }

    @ResponseBody
    @PostMapping(value = "getEmailExists")          // 이메일 중복찾기
    public UserInfoDTO getEmailExists(HttpServletRequest request) throws Exception {

        log.info(this.getClass().getName() + ".getEmailExists 시작!");

        String email = CmmUtil.nvl(request.getParameter("email"));

        log.info("email : " + email);

        UserInfoDTO pDTO = new UserInfoDTO();
        pDTO.setEmail(EncryptUtil.encAES128CBC(email));

        UserInfoDTO rDTO = Optional.ofNullable(userInfoService.getEmailExists(pDTO)).orElseGet(UserInfoDTO::new);

        log.info(this.getClass().getName() + ".getEmailExists 끝!");

        return rDTO;
    }

    @ResponseBody
    @PostMapping(value = "getEmailSend")            // 메일 보내기
    public UserInfoDTO getEmailSend(HttpServletRequest request) throws Exception {

        log.info(this.getClass().getName() + ".getEmailSend 시작!");

        String email = CmmUtil.nvl(request.getParameter("email"));

        log.info("email : " + email);

        UserInfoDTO pDTO = new UserInfoDTO();
        pDTO.setEmail(EncryptUtil.encAES128CBC(email));

        UserInfoDTO rDTO = Optional.ofNullable(userInfoService.getEmailSend(pDTO)).orElseGet(UserInfoDTO::new);

        log.info(this.getClass().getName() + ".getEmailSend 끝!");

        return rDTO;
    }

    @ResponseBody
    @PostMapping(value = "newUserNameProc")         // 닉네임 변경하기
    public MsgDTO newUserNameProc(HttpServletRequest request, HttpSession session) throws Exception {

        log.info(this.getClass().getName() + ".newUserNameProc Start!");

        MsgDTO dto = null;
        String msg = "";

        try {
            String userId = (String)session.getAttribute("SS_USER_ID");
            String userName = request.getParameter("userName");
            log.info("userId : " + userId);
            log.info("userName : " + userName);
            UserInfoDTO pDTO = new UserInfoDTO();

            pDTO.setUserId(userId);
            pDTO.setUserName(userName);

            userInfoService.newUserNameProc(pDTO);

            msg = "닉네임이 재설정되었습니다.";

        } catch (Exception e) {
            msg = "시스템 문제로 닉네임 변경이 실패하였습니다." + e.getMessage();
            log.info(e.toString());
            e.printStackTrace();
        } finally {
            dto = new MsgDTO();
            dto.setMsg(msg);
        }

        log.info(this.getClass().getName() + ".newUserNameProc End!");

        String userName = (String) session.getAttribute("SS_USER_NAME");

        return dto;
    }

    @GetMapping(value = "changeUserName")
    public String changeUserName() throws Exception{
        log.info(this.getClass().getName() + ".changeUserName Start!");

        return "/user/changeUserName";
    }

    @ResponseBody
    @PostMapping(value = "gradeProc")         // 등급 수정하기
    public MsgDTO gradeProc(@RequestBody UserInfoDTO userInfoDTO, HttpSession session) throws Exception {

        log.info(this.getClass().getName() + ".gradeProc Start!");

        MsgDTO dto = null;
        String msg = "";

        try {
            String userId = (String)session.getAttribute("SS_USER_ID");
            String grade = userInfoDTO.getGrade();
            log.info("userId : " + userId);
            log.info("grade : " + grade);
            UserInfoDTO pDTO = new UserInfoDTO();

            pDTO.setUserId(userId);
            pDTO.setGrade(grade);

            userInfoService.updateGrade(pDTO);

            msg = "거북목 측정이 완료되었습니다!";

        } catch (Exception e) {
            msg = "시스템 문제로 거북목 측정이 실패하였습니다." + e.getMessage();
            log.info(e.toString());
            e.printStackTrace();
        } finally {
            dto = new MsgDTO();
            dto.setMsg(msg);
        }

        log.info(this.getClass().getName() + ".gradeProc End!");

        return dto;
    }
}
