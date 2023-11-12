package kopo.poly.service;

import kopo.poly.dto.ChartDTO;

import java.util.List;

public interface IChartService {
    void insertData(ChartDTO pDTO) throws Exception;

    ChartDTO getData(ChartDTO pDTO) throws Exception;

    List<ChartDTO> getWeek(ChartDTO pDTO) throws Exception;
}
