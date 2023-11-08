package kopo.poly.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import kopo.poly.dto.VideoInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class YoutubeService {
    @Value("${youtube.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<VideoInfo> search(String query) {
        String url = UriComponentsBuilder.fromHttpUrl(YOUTUBE_SEARCH_URL)
                .queryParam("key", apiKey)
                .queryParam("part", "snippet")
                .queryParam("type", "video")
                .queryParam("q", query)
                .queryParam("maxResults", 3)
                .encode(StandardCharsets.UTF_8)
                .toUriString();

        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode items = rootNode.path("items");

            List<VideoInfo> videoInfos = new ArrayList<>();
            for (JsonNode item : items) {
                String videoId = item.path("id").path("videoId").asText();
                String title = item.path("snippet").path("title").asText();
                videoInfos.add(new VideoInfo(videoId, title));
            }

            return videoInfos;
        } catch (Exception e) {
            // Log and handle the exception
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
