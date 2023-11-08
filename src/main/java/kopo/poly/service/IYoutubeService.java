package kopo.poly.service;

import kopo.poly.dto.VideoInfo;

import java.util.List;

public interface IYoutubeService {

    public List<VideoInfo> search(String query) throws Exception;

}
