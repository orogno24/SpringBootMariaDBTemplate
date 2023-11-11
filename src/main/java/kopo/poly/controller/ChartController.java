package kopo.poly.controller;

import kopo.poly.dto.ChartDTO;
import kopo.poly.dto.MsgDTO;
import kopo.poly.dto.NoticeDTO;
import kopo.poly.dto.UserInfoDTO;
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

        /*
         * 값 전달은 반드시 DTO 객체를 이용해서 처리함 전달 받은 값을 DTO 객체에 넣는다.
         */
        ChartDTO pDTO = new ChartDTO();
        pDTO.setUserId(userId);

        // Java 8부터 제공되는 Optional 활용하여 NPE(Null Pointer Exception) 처리
        ChartDTO rDTO = Optional.ofNullable(chartService.getData(pDTO)).orElseGet(ChartDTO::new);

        log.info("TotalNormal: " + rDTO.getTotalNormal());
        log.info("TotalAbnormal: " + rDTO.getTotalAbnormal());

        // 조회된 리스트 결과값 넣어주기
        model.addAttribute("rDTO", rDTO);

        log.info(this.getClass().getName() + ".dounut End!");

        return "chart/dounut";
    }

}
