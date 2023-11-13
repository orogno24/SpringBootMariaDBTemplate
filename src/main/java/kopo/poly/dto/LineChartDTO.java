package kopo.poly.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LineChartDTO {

    private long LineSeq;

    private String normal;

    private String abnormal;

    private int totalNormal;

    private int totalAbnormal;

    private long PoseSeq;
}
