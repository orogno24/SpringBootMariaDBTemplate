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

            log.info("session user_id : " + userId);
            log.info("normal : " + normal);
            log.info("abnormal : " + abnormal);

            // 데이터 저장하기 위해 DTO에 저장하기
            ChartDTO pDTO = new ChartDTO();
            pDTO.setUserId(userId);
            pDTO.setNormal(normal);
            pDTO.setAbnormal(abnormal);

            chartService.insertData(pDTO);

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

    @GetMapping("dounut")
    public String dounut(HttpServletRequest request, ModelMap model, HttpSession session) throws Exception {
        log.info(this.getClass().getName() + ".dounut 함수 실행");

        String userId = CmmUtil.nvl((String) session.getAttribute("SS_USER_ID"));

        log.info("session user_id : " + userId);

        ChartDTO pDTO = new ChartDTO();
        pDTO.setUserId(userId);

        ChartDTO rDTO = Optional.ofNullable(chartService.getData(pDTO)).orElseGet(ChartDTO::new);
        List<ChartDTO> rList = Optional.ofNullable(chartService.getWeek(pDTO))
                .orElseGet(ArrayList::new);

        log.info("TotalNormal: " + rDTO.getTotalNormal());
        log.info("TotalAbnormal: " + rDTO.getTotalAbnormal());

        // 조회된 리스트 결과값 넣어주기
        model.addAttribute("chartData", rList);

        model.addAttribute("rDTO", rDTO);

        log.info(this.getClass().getName() + ".dounut End!");

        return "chart/dounut";
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, ModelMap model) throws Exception {
        log.info(this.getClass().getName() + ".dashboard 함수 실행");

        String userId = CmmUtil.nvl((String) session.getAttribute("SS_USER_ID"));

        log.info("session user_id : " + userId);

        ChartDTO pDTO = new ChartDTO();
        pDTO.setUserId(userId);

        ChartDTO rDTO = Optional.ofNullable(chartService.getData(pDTO)).orElseGet(ChartDTO::new);
        List<ChartDTO> rList = Optional.ofNullable(chartService.getWeek(pDTO))
                .orElseGet(ArrayList::new);

        log.info("TotalNormal: " + rDTO.getTotalNormal());
        log.info("TotalAbnormal: " + rDTO.getTotalAbnormal());

        // 조회된 리스트 결과값 넣어주기
        model.addAttribute("chartData", rList);

        model.addAttribute("rDTO", rDTO);

        String userName = (String) session.getAttribute("SS_USER_NAME");
        model.addAttribute("userName", userName);

        return "/chart/dashboard";
    }

    @GetMapping("/dashboard2")
    public String dashboard2(HttpSession session, ModelMap model) throws Exception {
        log.info(this.getClass().getName() + ".dashboard2 함수 실행");
        String userName = (String) session.getAttribute("SS_USER_NAME");
        model.addAttribute("userName", userName);
        return "/chart/dashboard2";
    }

    @ResponseBody
    @PostMapping(value = "insertLineChart")
    public MsgDTO insertLineData(HttpServletRequest request) {

        log.info(this.getClass().getName() + ".insertLineData Start!");

        String msg = ""; // 메시지 내용
        String url = "/main";

        MsgDTO dto = null; // 결과 메시지 구조

        try {
            String normal = CmmUtil.nvl(request.getParameter("normalPostureCount"));
            String abnormal = CmmUtil.nvl(request.getParameter("abnormalPostureCount"));

            log.info("normal : " + normal);
            log.info("abnormal : " + abnormal);

            // 데이터 저장하기 위해 DTO에 저장하기
            LineChartDTO pDTO = new LineChartDTO();
            pDTO.setNormal(normal);
            pDTO.setAbnormal(abnormal);

            chartService.insertLineData(pDTO);

            msg = "등록되었습니다.";

        } catch (Exception e) {

            msg = "실패하였습니다. : " + e.getMessage();
            log.info(e.toString());
            e.printStackTrace();

        } finally {
            dto = new MsgDTO();
            dto.setMsg(msg);

            log.info(this.getClass().getName() + ".insertLineData End!");
        }

        return dto;
    }
}
