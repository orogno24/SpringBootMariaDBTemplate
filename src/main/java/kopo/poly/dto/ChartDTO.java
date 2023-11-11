package kopo.poly.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChartDTO {
    private long PoseSeq;

    private String userId;

    private String date;

    private String week;

    private String normal;

    private String abnormal;

    private int totalNormal;

    private int totalAbnormal;
}