package kopo.poly.service.impl;

import kopo.poly.dto.ChartDTO;
import kopo.poly.dto.MailDTO;
import kopo.poly.dto.UserInfoDTO;
import kopo.poly.persistance.mapper.IChartMapper;
import kopo.poly.persistance.mapper.IUserInfoMapper;
import kopo.poly.service.IChartService;
import kopo.poly.service.IMailService;
import kopo.poly.service.IUserInfoService;
import kopo.poly.util.CmmUtil;
import kopo.poly.util.DateUtil;
import kopo.poly.util.EncryptUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@RequiredArgsConstructor
@Service

public class ChartService implements IChartService {

    private final IChartMapper chartMapper; // Mapper 가져오기

    @Transactional
    @Override
    public void insertData(ChartDTO pDTO) throws Exception {

        log.info(this.getClass().getName() + ".insertData start!");

        chartMapper.insertData(pDTO);

    }

    @Override
    public ChartDTO getData(ChartDTO pDTO) throws Exception {

        log.info(this.getClass().getName() + ".getData start!");

        return chartMapper.getData(pDTO);
    }

    @Override
    public List<ChartDTO> getWeek(ChartDTO pDTO) throws Exception {

        log.info(this.getClass().getName() + ".getWeek start!");

        return chartMapper.getWeek(pDTO);
    }
}
