package kopo.poly.controller;

import kopo.poly.dto.*;
import kopo.poly.service.IChartService;
import kopo.poly.service.IUserInfoService;
import kopo.poly.util.CmmUtil;
import kopo.poly.util.EncryptUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequestMapping(value = "/chart")
@RequiredArgsConstructor
@Controller
public class ChartController {

    private final IChartService chartService; // 서비스는 모든 컨트롤러 함수에서 실행시킬 수 있어야 하므로 전역변수로 선언함.
    private final IUserInfoService userInfoService; // 서비스는 모든 컨트롤러 함수에서 실행시킬 수 있어야 하므로 전역변수로 선언함.

    @ResponseBody
    @PostMapping(value = "insertChart")
    public MsgDTO insertData(HttpServletRequest request, HttpSession session) {

        log.info(this.getClass().getName() + ".insertData Start!");

        String msg = ""; // 메시지 내용
        String url = "/main";

        MsgDTO dto = null; // 결과 메시지 구조

        try {
            String userId = CmmUtil.nvl((String) session.getAttribute("SS_USER_ID"));
            String normal = CmmUtil.nvl(request.getParameter("normalPostureCount"));
            String abnormal = CmmUtil.nvl(request.getParameter("abnormalPostureCount"));
            String totalTime = CmmUtil.nvl(request.getParameter("totalTime"));
            String point = CmmUtil.nvl(request.getParameter("point"));

            log.info("session user_id : " + userId);
            log.info("normal : " + normal);
            log.info("abnormal : " + abnormal);
            log.info("totalTime : " + totalTime);
            log.info("point : " + point);

            // 데이터 저장하기 위해 DTO에 저장하기
            ChartDTO pDTO = new ChartDTO();
            UserInfoDTO uDTO = new UserInfoDTO();

            pDTO.setUserId(userId);
            pDTO.setNormal(normal);
            pDTO.setAbnormal(abnormal);
            pDTO.setTotalTime(totalTime);

            uDTO.setUserId(userId);
            uDTO.setPoint(point);

            chartService.insertData(pDTO);
            userInfoService.updatePoint(uDTO);

            msg = "등록되었습니다.";

        } catch (Exception e) {

            msg = "실패하였습니다. : " + e.getMessage();
            log.info(e.toString());
            e.printStackTrace();

        } finally {
            dto = new MsgDTO();
            dto.setMsg(msg);

            log.info(this.getClass().getName() + ".insertData End!");
        }

        return dto;
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, ModelMap model) throws Exception {
        log.info(this.getClass().getName() + ".dashboard 함수 실행");

        String userId = CmmUtil.nvl((String) session.getAttribute("SS_USER_ID"));

        log.info("session user_id : " + userId);

        ChartDTO pDTO = new ChartDTO();
        pDTO.setUserId(userId);

        UserInfoDTO uDTO = new UserInfoDTO();
        uDTO.setUserId(userId);

        UserInfoDTO Point = Optional.ofNullable(userInfoService.getGrade(uDTO))
                .orElseGet(UserInfoDTO::new);
        ChartDTO rDTO = Optional.ofNullable(chartService.getData(pDTO)).orElseGet(ChartDTO::new);
        ChartDTO tDTO = Optional.ofNullable(chartService.getTotalData(pDTO)).orElseGet(ChartDTO::new);
        List<ChartDTO> rList = Optional.ofNullable(chartService.getWeek(pDTO))
                .orElseGet(ArrayList::new);
        List<ChartDTO> tList = Optional.ofNullable(chartService.getTimeList(pDTO))
                .orElseGet(ArrayList::new);
        List<ChartDTO> vList = Optional.ofNullable(chartService.getTimeMinute(pDTO))
                .orElseGet(ArrayList::new);
        List<ChartDTO> jList = Optional.ofNullable(chartService.getTimeFive(pDTO))
                .orElseGet(ArrayList::new);

        log.info("TotalTime: " + rDTO.getTotalTime());
        log.info("TotalNormal: " + rDTO.getTotalNormal());
        log.info("TotalAbnormal: " + rDTO.getTotalAbnormal());

        if (rDTO.getTotalTime() == null || rDTO.getTotalTime().isEmpty()) {
            rDTO.setTotalTime(String.valueOf(0));
        }

        log.info("newTotalTime: " + rDTO.getTotalTime());

        if (tList != null) {
            for (ChartDTO item : tList) {
                log.info(item.toString());
            }
        }

        model.addAttribute("rList", rList); // 주간별 사용 통계 리스트를 통계 페이지로 전송
        model.addAttribute("tList", tList); // 분당 사용 통계 리스트를 통계 페이지로 전송
        model.addAttribute("vList", vList); // 5분당 사용 통계 리스트를 통계 페이지로 전송
        model.addAttribute("jList", jList); // 1시간당 사용 통계 리스트를 통계 페이지로 전송
        model.addAttribute("rDTO", rDTO);
        model.addAttribute("tDTO", tDTO);
        model.addAttribute("Point", Point);

        String userName = (String) session.getAttribute("SS_USER_NAME");
        model.addAttribute("userName", userName);

        return "/chart/dashboard";
    }

}
