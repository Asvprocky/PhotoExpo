package com.example.backend.dto.request;

import com.example.backend.domain.Users;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestDTO {

    public interface existGroup {
    }

    public interface addGroup {
    }

    public interface passwordGroup {
    }


    public interface updateGroup {
    }

    public interface deleteGroup {

    }

    // 로그인 ID (이메일)
    @NotBlank(groups = {existGroup.class, addGroup.class, updateGroup.class, deleteGroup.class})
    @Email(groups = {existGroup.class, addGroup.class, updateGroup.class, deleteGroup.class})
    private String email;

    // 비밀번호
    @NotBlank(groups = {addGroup.class, passwordGroup.class})
    @Size(min = 4)
    private String password;

    // 닉네임 (서비스 내 별명)
    @NotBlank(groups = {addGroup.class, updateGroup.class})
    @Size(min = 2, max = 20)
    private String nickname;

    // 사용자 이름 (실명)
    @NotBlank(groups = {addGroup.class, updateGroup.class})
    @Size(min = 2, max = 20)
    private String username;


    public Users toEntity() {
        return Users.builder()
                .email(this.email)
                .password(this.password)
                .nickname(this.nickname)
                .username(this.username)
                .isLock(false)
                .isSocial(false)
                .build();

    }
}
