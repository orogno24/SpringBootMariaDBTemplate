package kopo.poly.service.impl;

import kopo.poly.dto.ChartDTO;
import kopo.poly.dto.LineChartDTO;
import kopo.poly.persistance.mapper.IChartMapper;
import kopo.poly.service.IChartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
    public ChartDTO getTotalData(ChartDTO pDTO) throws Exception {

        log.info(this.getClass().getName() + ".getTotalData start!");

        return chartMapper.getTotalData(pDTO);
    }


    @Override
    public List<ChartDTO> getWeek(ChartDTO pDTO) throws Exception {

        log.info(this.getClass().getName() + ".getWeek start!");

        return chartMapper.getWeek(pDTO);
    }

    @Scheduled(fixedRate = 600)           // 1분주기로 실행
    @Transactional
    @Override
    public void insertLineData(LineChartDTO pDTO) throws Exception {
        log.info(this.getClass().getName() + ".insertLineData Start!");

        chartMapper.insertLineData(pDTO);
    }

    @Override
    public ChartDTO getTime(ChartDTO pDTO) throws Exception {
        log.info(this.getClass().getName() + ".getTime Start!");

        return chartMapper.getTime(pDTO);
    }

}
