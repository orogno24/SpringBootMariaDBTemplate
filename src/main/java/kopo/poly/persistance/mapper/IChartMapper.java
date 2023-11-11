package kopo.poly.persistance.mapper;

import kopo.poly.dto.ChartDTO;
import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface IChartMapper {

    void insertData(ChartDTO pDTO) throws Exception;

    ChartDTO getData(ChartDTO pDTO) throws Exception;

}
