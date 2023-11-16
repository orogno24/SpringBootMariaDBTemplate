package kopo.poly.persistance.mapper;

import kopo.poly.dto.ChartDTO;
import kopo.poly.dto.LineChartDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;


@Mapper
public interface IChartMapper {

    void insertData(ChartDTO pDTO) throws Exception;

    ChartDTO getData(ChartDTO pDTO) throws Exception;

    ChartDTO getTotalData(ChartDTO pDTO) throws Exception;

    List<ChartDTO> getWeek(ChartDTO pDTO) throws Exception;

    void insertLineData(LineChartDTO pDTO) throws Exception;

    List<LineChartDTO> getLineData(LineChartDTO pDTO) throws Exception;


}
