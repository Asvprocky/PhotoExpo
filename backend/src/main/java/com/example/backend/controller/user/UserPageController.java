package com.example.backend.controller.user;

import com.example.backend.dto.response.UserPageResponseDTO;
import com.example.backend.service.user.UserPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserPageController {

    private final UserPageService userPageService;

    @GetMapping("/{userId}")
    public UserPageResponseDTO getUserPage(@PathVariable Long userId) {
        return userPageService.getUserPage(userId);
    }
}
