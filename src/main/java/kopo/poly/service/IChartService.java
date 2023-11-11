package kopo.poly.service;

import kopo.poly.dto.ChartDTO;

public interface IChartService {
    void insertData(ChartDTO pDTO) throws Exception;

    ChartDTO getData(ChartDTO pDTO) throws Exception;
}
